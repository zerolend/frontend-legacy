import {
  ERC20Service,
  gasLimitRecommendations,
  MAX_UINT_AMOUNT,
  ProtocolAction,
} from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { parseEther } from 'ethers/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Options } from '@layerzerolabs/lz-v2-utilities';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { getErrorTextFromError, TxAction } from 'src/ui-config/errorMapping';
import { permitByChainAndToken } from 'src/ui-config/permitConfig';
import { getNetworkConfig, getProvider } from 'src/utils/marketsAndNetworksConfig';

import { TxActionsWrapper } from '../TxActionsWrapper';
import { APPROVAL_GAS_LIMIT } from '../utils';
import { ethers } from 'ethers';
import { getCurMarketData } from './common';

interface SwithProps {
  inputAmount: string;
  inputToken: string;
  outputToken: string;
  blocked: boolean;
  loading?: boolean;
  isWrongNetwork: boolean;
  chainId: number;
  inputName: string;
  outputName: string;
  targetEId: number;
}

export const BridgeActions = ({
  inputAmount,
  inputToken,
  inputName,
  blocked,
  loading,
  isWrongNetwork,
  chainId,
  targetEId,
}: SwithProps) => {
  const [user, generateApproval, estimateGasLimit, addTransaction, bridge, quoteBridge] =
    useRootStore((state) => [
      state.account,
      state.generateApproval,
      state.estimateGasLimit,
      state.addTransaction,
      state.bridge,
      state.quoteBridge,
    ]);

  const {
    approvalTxState,
    mainTxState,
    loadingTxns,
    setMainTxState,
    setTxError,
    setGasLimit,
    setLoadingTxns,
    setApprovalTxState,
  } = useModalContext();

  const { sendTx } = useWeb3Context();
  const networkConfig = getNetworkConfig(chainId);
  const [approvedAmount, setApprovedAmount] = useState<number | undefined>(undefined);
  const tryPermit = permitByChainAndToken[chainId]?.[inputToken];
  const currentMarketData = getCurMarketData(chainId);

  const requiresApproval = useMemo(() => {
    if (
      approvedAmount === undefined ||
      approvedAmount === -1 ||
      inputAmount === '0' ||
      isWrongNetwork
    )
      return false;
    else return approvedAmount < Number(inputAmount);
  }, [approvedAmount, inputAmount, isWrongNetwork]);

  const action = async () => {
    try {
      if (currentMarketData) {
        setMainTxState({ ...mainTxState, loading: true });
        const options = Options.newOptions()
          .addExecutorLzReceiveOption(200000, 0)
          .toHex()
          .toString();

        const sendParam = {
          dstEid: targetEId,
          to: ethers.utils.hexZeroPad(user, 32),
          amountLD: parseEther(inputAmount).toString(),
          minAmountLD: parseEther(Math.floor(parseFloat(inputAmount)).toString()).toString(),
          extraOptions: options,
          composeMsg: ethers.utils.arrayify('0x'), // Assuming no composed message
          oftCmd: ethers.utils.arrayify('0x'), // Assuming no OFT command is needed
        };

        const quoteFee = await quoteBridge({
          params: sendParam,
          contract:
            currentMarketData.addresses.OFT_ADAPTER ?? (currentMarketData?.addresses.OFT as string),
          chainId,
          isAdapter: networkConfig.bridge?.oftAdapter ? true : false,
        });

        const txData = await bridge({
          params: sendParam,
          fee: {
            nativeFee: quoteFee.nativeFee,
            lzTokenFee: 0,
          },
          contract:
            currentMarketData.addresses.OFT_ADAPTER ?? (currentMarketData?.addresses.OFT as string),
          isAdapter: networkConfig.bridge?.oftAdapter ? true : false,
        });

        if (!txData) return;
        const response = await sendTx(txData);

        await response.wait(1);

        addTransaction(response.hash, {
          txState: 'success',
          ...txData,
        });
        setMainTxState({
          txHash: response.hash,
          loading: false,
          success: true,
        });
      }
    } catch (error) {
      const parsedError = getErrorTextFromError(error, TxAction.GAS_ESTIMATION, false);
      setTxError(parsedError);
      setMainTxState({
        txHash: undefined,
        loading: false,
      });
    }
  };

  const approval = async () => {
    if (Number(approvedAmount) < Number(inputAmount)) {
      try {
        let approveTxData = generateApproval({
          user,
          token: inputToken,
          spender:
            currentMarketData?.addresses.OFT_ADAPTER ??
            (currentMarketData?.addresses.OFT as string),
          amount: MAX_UINT_AMOUNT,
        });
        setApprovalTxState({ ...approvalTxState, loading: true });
        approveTxData = await estimateGasLimit(approveTxData);
        const response = await sendTx(approveTxData);

        await response.wait(1);
        setApprovalTxState({
          txHash: response.hash,
          loading: false,
          success: true,
        });
        addTransaction(response.hash, {
          action: ProtocolAction.approval,
          txState: 'success',
          asset: inputToken,
          amount: MAX_UINT_AMOUNT,
          assetName: inputName,
        });
        fetchApprovedAmount();
      } catch (error) {
        const parsedError = getErrorTextFromError(error, TxAction.GAS_ESTIMATION, false);
        setTxError(parsedError);
        setApprovalTxState({
          txHash: undefined,
          loading: false,
        });
      }
    }
  };

  const fetchApprovedAmount = useCallback(async () => {
    if (networkConfig.bridge?.oftAdapter) {
      try {
        setApprovalTxState({
          txHash: undefined,
          loading: false,
          success: false,
        });
        setLoadingTxns(true);
        const rpc = getProvider(chainId);
        const erc20Service = new ERC20Service(rpc);
        const approvedTargetAmount = await erc20Service.approvedAmount({
          user,
          token: inputToken,
          spender:
            currentMarketData?.addresses.OFT_ADAPTER ??
            (currentMarketData?.addresses.OFT as string),
        });
        setApprovedAmount(approvedTargetAmount);
        setLoadingTxns(false);
      } catch (error) {
        console.log('Error: ', error);
      }
    }
  }, [chainId, setLoadingTxns, user, inputToken, setApprovalTxState]);

  useEffect(() => {
    if (user) {
      fetchApprovedAmount();
    }
  }, [fetchApprovedAmount, user]);

  useEffect(() => {
    let bridgeGasLimit = 0;
    bridgeGasLimit = Number(gasLimitRecommendations[ProtocolAction.default].recommended);
    if (requiresApproval && !approvalTxState.success) {
      bridgeGasLimit += Number(APPROVAL_GAS_LIMIT);
    }
    setGasLimit(bridgeGasLimit.toString());
  }, [requiresApproval, approvalTxState, setGasLimit]);

  return (
    <TxActionsWrapper
      mainTxState={mainTxState}
      approvalTxState={approvalTxState}
      isWrongNetwork={isWrongNetwork}
      preparingTransactions={loadingTxns}
      handleAction={action}
      requiresAmount
      amount={inputAmount}
      handleApproval={() => approval()}
      requiresApproval={!blocked && requiresApproval}
      actionText={<Trans>Bridge</Trans>}
      actionInProgressText={<Trans>Bridging</Trans>}
      errorParams={{
        loading: false,
        disabled: blocked || (!approvalTxState.success && requiresApproval),
        content: <Trans>Bridge</Trans>,
        handleClick: action,
      }}
      fetchingData={loading}
      blocked={blocked}
      tryPermit={tryPermit}
    />
  );
};
