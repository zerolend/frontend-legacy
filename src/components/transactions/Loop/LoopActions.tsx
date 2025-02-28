import {
  API_ETH_MOCK_ADDRESS,
  ApproveDelegationType,
  ApproveType,
  gasLimitRecommendations,
  MAX_UINT_AMOUNT,
  ProtocolAction,
} from '@aave/contract-helpers';
import { TransactionResponse } from '@ethersproject/providers';
import { Trans } from '@lingui/macro';
import { BoxProps } from '@mui/material';
import { keccak256, parseUnits, serializeTransaction } from 'ethers/lib/utils';
import { queryClient } from 'pages/_app.page';
import React, { useCallback, useEffect, useState } from 'react';
import { useBackgroundDataProvider } from 'src/hooks/app-data-provider/BackgroundDataProvider';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { getErrorTextFromError, TxAction } from 'src/ui-config/errorMapping';
import { QueryKeys } from 'src/ui-config/queries';

import { TxActionsWrapper } from '../TxActionsWrapper';
import { APPROVE_DELEGATION_GAS_LIMIT, checkRequiresApproval } from '../utils';
import { PopulatedTransaction } from 'ethers';
import { calculateLoop, calculateRealLoopAmount } from 'src/utils/utils';

export interface LoopActionProps extends BoxProps {
  feeTokenAddress?: string;
  amountToSupply: string;
  isWrongNetwork: boolean;
  customGasPrice?: string;
  poolAddress: string;
  symbol: string;
  txHash?: string;
  setTxHash: (hash: string) => void;
  blocked: boolean;
  decimals: number;
  isGaslessDisable?: boolean;
  leverageContractAddress: string;
  leverage: number;
  maxAmountToSupply?: string;
  isDepositLoop: boolean;
  maxFormattedLTV: string;
  maxBaseLTV: string;
  debtTokenAddress: string;
  interestMode: boolean;
  isStrategy?: boolean;
}

export const LoopActions = React.memo(
  ({
    amountToSupply,
    poolAddress,
    feeTokenAddress,
    txHash,
    setTxHash,
    isWrongNetwork,
    sx,
    symbol,
    blocked,
    decimals,
    isGaslessDisable,
    leverageContractAddress,
    leverage,
    maxAmountToSupply,
    isDepositLoop,
    maxFormattedLTV,
    maxBaseLTV,
    debtTokenAddress,
    interestMode,
    isStrategy,
    ...props
  }: LoopActionProps) => {
    const [
      tryPermit,
      getLoopApprovedAmount,
      fetchPaymasterData,
      generateApproval,
      estimateGasLimit,
      addTransaction,
      loop,
      loopETH,
      getCreditDelegationApprovedAmount,
      generateApproveDelegation,
    ] = useRootStore((state) => [
      state.tryPermit,
      state.getLoopApprovedAmount,
      state.fetchPaymasterData,
      state.generateApproval,
      state.estimateGasLimit,
      state.addTransaction,
      state.loop,
      state.loopETH,
      state.getCreditDelegationApprovedAmount,
      state.generateApproveDelegation,
    ]);
    const {
      approvalTxState,
      mainTxState,
      loadingTxns,
      setLoadingTxns,
      setApprovalTxState,
      setMainTxState,
      setGasLimit,
      setTxError,
    } = useModalContext();

    const paymasterData = useRootStore((state) =>
      txHash && state.paymasterData[txHash] && state.paymasterData[txHash].data
        ? state.paymasterData[txHash].data
        : undefined
    );

    const { refetchPoolData, refetchIncentiveData, refetchGhoData } = useBackgroundDataProvider();
    const permitAvailable = tryPermit(leverageContractAddress);
    const { sendGaslessTx, sendTx } = useWeb3Context();

    const [approvedAmount, setApprovedAmount] = useState<ApproveType | undefined>();
    const [creditDelegationAmount, setCreditDelegationAmount] = useState<
      ApproveDelegationType | undefined
    >();
    const [borrowApprovedAmount, setBorrowApprovedAmount] = useState<
      ApproveDelegationType | undefined
    >();
    const [requiresApproval, setRequiresApproval] = useState<boolean>(false);
    const [requiresDelegateApproval, setRequiresDelegateApproval] = useState<boolean>(false);
    const [requiresBorrowApproval, setRequiresBorrowApproval] = useState<boolean>(false);

    // callback to fetch approved amount and determine execution path on dependency updates
    const fetchApprovedAmount = useCallback(
      async (forceApprovalCheck?: boolean) => {
        // Check approved amount on-chain on first load or if an action triggers a re-check such as an approval being confirmed
        if (isDepositLoop) {
          if (!approvedAmount || forceApprovalCheck) {
            setLoadingTxns(true);
            const approvedAmount = await getLoopApprovedAmount({
              token: poolAddress,
              spender: leverageContractAddress,
            });
            setApprovedAmount(approvedAmount);
          }
          if (approvedAmount) {
            const fetchedRequiresApproval = checkRequiresApproval({
              approvedAmount: approvedAmount.amount,
              amount: amountToSupply,
              signedAmount: '0',
            });
            setRequiresApproval(fetchedRequiresApproval);
            if (fetchedRequiresApproval) setApprovalTxState({});
          }

          if (!creditDelegationAmount || forceApprovalCheck) {
            setLoadingTxns(true);
            const creditDelegationAmount = await getCreditDelegationApprovedAmount({
              debtTokenAddress,
              delegatee: leverageContractAddress,
            });
            setCreditDelegationAmount(creditDelegationAmount);
          }
          if (creditDelegationAmount) {
            const fetchedRequiresApproval = checkRequiresApproval({
              approvedAmount: creditDelegationAmount.amount,
              amount: amountToSupply,
              signedAmount: '0',
            });
            setRequiresDelegateApproval(fetchedRequiresApproval);
            if (fetchedRequiresApproval) setApprovalTxState({});
          }
        } else {
          if (
            poolAddress === API_ETH_MOCK_ADDRESS &&
            (borrowApprovedAmount === undefined || forceApprovalCheck)
          ) {
            setLoadingTxns(true);
            const approvedAmount = await getCreditDelegationApprovedAmount({
              debtTokenAddress,
              delegatee: leverageContractAddress,
            });
            setBorrowApprovedAmount(approvedAmount);
          } else {
            setRequiresBorrowApproval(false);
            setApprovalTxState({});
          }

          if (approvedAmount && poolAddress === API_ETH_MOCK_ADDRESS) {
            const fetchedRequiresApproval = checkRequiresApproval({
              approvedAmount: approvedAmount.amount,
              amount: amountToSupply,
              signedAmount: '0',
            });
            setRequiresBorrowApproval(fetchedRequiresApproval);
            if (fetchedRequiresApproval) setApprovalTxState({});
          }
        }
        setLoadingTxns(false);
      },
      [
        approvedAmount,
        creditDelegationAmount,
        borrowApprovedAmount,
        setLoadingTxns,
        getLoopApprovedAmount,
        poolAddress,
        amountToSupply,
        setApprovalTxState,
      ]
    );

    // Run on first load to decide execution path
    useEffect(() => {
      fetchApprovedAmount();
    }, [fetchApprovedAmount]);

    // Update gas estimation
    useEffect(() => {
      if (isDepositLoop) {
        let supplyGasLimit = Number(gasLimitRecommendations[ProtocolAction.supply].recommended);
        setGasLimit(supplyGasLimit.toString());
      } else {
        let borrowGasLimit = 0;
        borrowGasLimit = Number(gasLimitRecommendations[ProtocolAction.borrow].recommended);
        if (requiresBorrowApproval && !approvalTxState.success) {
          borrowGasLimit += Number(APPROVE_DELEGATION_GAS_LIMIT);
        }
        setGasLimit(borrowGasLimit.toString());
      }
    }, [
      requiresApproval,
      requiresDelegateApproval,
      requiresBorrowApproval,
      approvalTxState,
      setGasLimit,
    ]);

    const getTx = async (): Promise<[ProtocolAction, PopulatedTransaction | undefined, number]> => {
      let action = ProtocolAction.default;
      if (
        Number(amountToSupply) == 0 ||
        (isDepositLoop && requiresDelegateApproval && creditDelegationAmount)
      )
        return [action, undefined, 0];
      const leverageAmount = Number(amountToSupply) * Number(leverage);
      const loopCount = calculateLoop(
        Number(maxFormattedLTV),
        leverageAmount,
        Number(amountToSupply),
        isDepositLoop
      );
      const loopLeverageTxData =
        poolAddress === API_ETH_MOCK_ADDRESS
          ? loopETH({
              amount: parseUnits(amountToSupply, decimals).toString(),
              interestRateMode: interestMode ? '1' : '2', // 1: Stable mode, 2: Variable mode
              borrowRatio: maxBaseLTV,
              loopCount: loopCount.toString(),
              isSupply: isDepositLoop,
              contract: leverageContractAddress,
            })
          : loop({
              amount: parseUnits(amountToSupply, decimals).toString(),
              asset: poolAddress,
              interestRateMode: interestMode ? '1' : '2', // 1: Stable mode, 2: Variable mode
              borrowRatio: maxBaseLTV,
              loopCount: loopCount.toString(),
              isBorrow: isDepositLoop ? false : true,
              contract: leverageContractAddress,
            });
      return [action, await estimateGasLimit(loopLeverageTxData), loopCount];
    };

    // Update paymaster data
    const updatePaymaster = useCallback(async () => {
      const [, tx] = await getTx();
      if (!tx || !feeTokenAddress) return;

      const { from, ...txToSign } = tx;
      const serialized = serializeTransaction(txToSign);
      const hash = keccak256(serialized);
      setTxHash(hash);

      fetchPaymasterData(hash, {
        feeTokenAddress,
        gasLimit: tx.gasLimit ? tx.gasLimit.toString() : '',
        txData: {
          from: tx.from || '',
          to: tx.to || '',
          value: tx.value ? tx.value.toString() : '',
          data: tx.data || '',
        },
      });
    }, [requiresDelegateApproval, feeTokenAddress, symbol]);

    useEffect(() => {
      updatePaymaster();
    }, [feeTokenAddress, amountToSupply, symbol]);

    const approval = async () => {
      try {
        if (
          (requiresApproval && approvedAmount) ||
          (requiresDelegateApproval && creditDelegationAmount) ||
          (requiresBorrowApproval && borrowApprovedAmount)
        ) {
          let response;
          if (requiresApproval && approvedAmount) {
            let approveTxData = generateApproval(approvedAmount);
            setApprovalTxState({ ...approvalTxState, loading: true });
            approveTxData = await estimateGasLimit(approveTxData);
            response = await sendTx(approveTxData);

            await response.wait(1);
          }
          if (
            (requiresDelegateApproval && creditDelegationAmount) ||
            (requiresBorrowApproval && borrowApprovedAmount)
          ) {
            let approveTxData = generateApproveDelegation({
              debtTokenAddress,
              delegatee: leverageContractAddress,
              amount: MAX_UINT_AMOUNT,
            });
            setApprovalTxState({ ...approvalTxState, loading: true });
            approveTxData = await estimateGasLimit(approveTxData);
            response = await sendTx(approveTxData);

            await response.wait(1);
          }

          setApprovalTxState({
            txHash: response?.hash,
            loading: false,
            success: true,
          });
          if (isDepositLoop) {
            addTransaction(response?.hash as string, {
              action: ProtocolAction.approval,
              txState: 'success',
              asset: poolAddress,
              amount: MAX_UINT_AMOUNT,
              assetName: symbol,
            });
          }
          fetchApprovedAmount(true);
        }
      } catch (error) {
        const parsedError = getErrorTextFromError(error, TxAction.GAS_ESTIMATION, false);
        setTxError(parsedError);
        setApprovalTxState({
          txHash: undefined,
          loading: false,
        });
      }
    };

    const action = async () => {
      try {
        setMainTxState({ ...mainTxState, loading: true });

        let response: TransactionResponse;
        const [action, supplyTxData, loopCount] = await getTx();
        if (!supplyTxData) return;

        if (paymasterData) response = await sendGaslessTx(paymasterData.txData);
        else response = await sendTx(supplyTxData);
        await response.wait(1);

        const realAmount = calculateRealLoopAmount(
          Number(maxFormattedLTV),
          loopCount,
          Number(amountToSupply),
          isDepositLoop
        );
        setMainTxState({
          txHash: response.hash,
          loading: false,
          amount: realAmount.toString(),
          success: true,
        });

        addTransaction(response.hash, {
          action,
          txState: 'success',
          asset: poolAddress,
          amount: realAmount.toString(),
          assetName: symbol,
        });

        queryClient.invalidateQueries({ queryKey: [QueryKeys.POOL_TOKENS] });
        refetchPoolData && refetchPoolData();
        refetchIncentiveData && refetchIncentiveData();
        refetchGhoData && refetchGhoData();
      } catch (error) {
        const parsedError = getErrorTextFromError(error, TxAction.GAS_ESTIMATION, false);
        setTxError(parsedError);
        setMainTxState({
          txHash: undefined,
          loading: false,
        });
      }
    };

    return Number(amountToSupply) > 0 ? (
      <TxActionsWrapper
        blocked={blocked}
        mainTxState={mainTxState}
        approvalTxState={approvalTxState}
        isWrongNetwork={isWrongNetwork}
        requiresAmount
        amount={amountToSupply}
        symbol={symbol}
        preparingTransactions={loadingTxns}
        actionText={isStrategy ? <Trans>Leverage</Trans> : <Trans>Loop Leverage {symbol}</Trans>}
        actionInProgressText={isStrategy ? <Trans>Looping</Trans> : <Trans>Looping {symbol}</Trans>}
        handleApproval={() => approval()}
        handleAction={action}
        requiresApproval={requiresApproval || requiresBorrowApproval || requiresDelegateApproval}
        tryPermit={permitAvailable}
        sx={sx}
        isGaslessDisable={isGaslessDisable}
        leverageContractAddress={leverageContractAddress}
        leverage={leverage}
        maxAmountToSupply={maxAmountToSupply}
        isStrategy={isStrategy ? true : false}
        {...props}
      />
    ) : (
      <></>
    );
  }
);
