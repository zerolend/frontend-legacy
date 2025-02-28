import { Trans } from '@lingui/macro';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';

import { TxErrorView } from '../FlowCommons/Error';
import { GasEstimationError } from '../FlowCommons/GasEstimationError';
import { TxSuccessView } from '../FlowCommons/Success';
import { DetailsInfoLine, DetailsNumberLine, TxModalDetails } from '../FlowCommons/TxModalDetails';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { ChangeNetworkWarning } from '../Warnings/ChangeNetworkWarning';
import { LockZeroAction } from './LockZeroAction';
import { DurationBonusMapping, futureDate, IDurations } from 'src/modules/lock/ZeroLock';
import { useRootStore } from 'src/store/root';
import { APPROVAL_GAS_LIMIT, checkRequiresApproval } from '../utils';
import { gasLimitRecommendations, MAX_UINT_AMOUNT, ProtocolAction } from '@aave/contract-helpers';
import { Typography } from '@mui/material';
import { zeroConfig } from 'src/ui-config/zeroConfig';

export type StakeProps = {
  icon: string;
  amount: string;
  duration: IDurations | undefined;
  stakeNFT: boolean;
  apr: string;
};

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

export const LockZeroModalContent = ({ icon, amount, duration, stakeNFT, apr }: StakeProps) => {
  const {
    chainId: connectedChainId,
    readOnlyModeAddress,
    sendTx,
    currentAccount,
  } = useWeb3Context();
  const {
    gasLimit,
    mainTxState,
    txError,
    setMainTxState,
    approvalTxState,
    setApprovalTxState,
    setGasLimit,
  } = useModalContext();
  const { currentChainId } = useProtocolDataContext();
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [requiresApproval, setRequiresApproval] = useState<boolean>(false);

  const amountRef = useRef<string>();

  const isWrongNetwork = connectedChainId !== currentChainId;

  const networkConfig = getNetworkConfig(currentChainId);

  const calculateDuration: number = useMemo(() => {
    if (duration === '4 years') return 4 * 365 * 24 * 60 * 60;
    else if (duration === '2 years') return 2 * 365 * 24 * 60 * 60;
    else if (duration === '1 year') return 1 * 365 * 24 * 60 * 60;
    else if (duration === '6 months') return 6 * 30 * 24 * 60 * 60;
    else return 3 * 30 * 24 * 60 * 60;
  }, [duration]);
  const veZeroCalc = useMemo(() => {
    let seconds;

    switch (duration) {
      case '3 months':
        seconds = 3 * 30 * 86400;
        break;
      case '6 months':
        seconds = 6 * 30 * 86400;
        break;
      case '1 year':
        seconds = 1 * 365 * 86400;
        break;
      case '2 years':
        seconds = 2 * 365 * 86400;
        break;
      case '4 years':
        seconds = 4 * 365 * 86400;
        break;
      default:
        throw new Error('Invalid duration');
    }
    let amountBonus = Number(amount);
    if (DurationBonusMapping[duration]) {
      amountBonus = Number(amount) + (Number(amount) * DurationBonusMapping[duration].perc) / 100;
    }
    return (seconds / 126144000) * amountBonus;
  }, [amount, duration]);

  const [
    generateLockApproval,
    estimateGasLimit,
    addTransaction,
    getLockApprovedAmount,
    createLock,
  ] = useRootStore((state) => [
    state.generateLockApproval,
    state.estimateGasLimit,
    state.addTransaction,
    state.getLockApprovedAmount,
    state.createLock,
  ]);

  // callback to fetch approved amount and determine execution path on dependency updates
  const fetchApprovedAmount = useCallback(
    async (forceApprovalCheck?: boolean) => {
      // Check approved amount on-chain on first load or if an action triggers a re-check such as an approval being confirmed
      if (!approvedAmount || forceApprovalCheck) {
        const approvedAmount = await getLockApprovedAmount({
          token: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
          spender: zeroConfig.crossChainAddresses[zeroConfig.chainId].STAKING_BONUS,
        });
        setApprovedAmount(approvedAmount);
      }

      if (approvedAmount === 0) {
        const fetchedRequiresApproval = checkRequiresApproval({
          approvedAmount: String(approvedAmount),
          amount: amount,
          signedAmount: '0',
        });
        setRequiresApproval(fetchedRequiresApproval);
        if (fetchedRequiresApproval) setApprovalTxState({});
      }
    },
    [approvedAmount, amount]
  );

  // Run on first load to decide execution path
  useEffect(() => {
    fetchApprovedAmount();
  }, [fetchApprovedAmount]);

  const approval = async () => {
    try {
      setApprovalTxState({
        ...approvalTxState,
        loading: true,
      });
      if (requiresApproval && approvedAmount === 0) {
        let approveTxData = await generateLockApproval({
          token: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
          lockerAddress: zeroConfig.crossChainAddresses[zeroConfig.chainId].STAKING_BONUS,
        });
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
          asset: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
          amount: MAX_UINT_AMOUNT,
        });
        fetchApprovedAmount(true);
      }
    } catch (error) {
      setApprovalTxState({
        txHash: undefined,
        loading: false,
      });
    }
  };

  const createLockHandler = async () => {
    try {
      setMainTxState({ ...mainTxState, loading: true });

      const tx = createLock({ amount, duration: calculateDuration, stakeNFT });

      const txData = await tx;
      txData.from = currentAccount;

      const res = await sendTx(txData);

      await res.wait(1);

      setMainTxState({
        txHash: res.hash,
        loading: false,
        success: true,
      });

      addTransaction(res.hash, {
        action: 'Lock',
        txState: 'success',
        asset: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
        amount: amount,
      });
    } catch (error) {
      console.log('err', error);
      setMainTxState({ txHash: undefined, loading: false });
    }
  };

  // Update gas estimation
  useEffect(() => {
    let supplyGasLimit = 0;
    supplyGasLimit = Number(gasLimitRecommendations[ProtocolAction.default].recommended);
    if (requiresApproval && !approvalTxState.success) {
      supplyGasLimit += Number(APPROVAL_GAS_LIMIT);
    }
    setGasLimit(supplyGasLimit.toString());
  }, [requiresApproval, approvalTxState, setGasLimit]);

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }
  if (mainTxState.success)
    return (
      <TxSuccessView
        action={<Trans>Stake</Trans>}
        amount={amountRef.current}
        symbol={icon}
        joinDiscord={true}
      />
    );

  return (
    <>
      <TxModalTitle title="Stake" symbol={icon} />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={currentChainId} />
      )}
      <TxModalDetails gasLimit={gasLimit}>
        {/* <DetailsNumberLine description={'Locking Amount'} value={amount} symbol={icon} /> */}
        <DetailsInfoLine description={'Locked Until'} value={duration && futureDate(duration)} />
        <DetailsInfoLine
          description={'ZERO Bonus'}
          value={
            duration && DurationBonusMapping[duration] ? DurationBonusMapping[duration].text : '-'
          }
        />
        <DetailsNumberLine description={'APR'} value={Number(apr) / 100} percent={true} />
        <DetailsInfoLine description={'Voting Power'} value={`~${veZeroCalc.toFixed(2)} veZERO`} />
        {stakeNFT &&
          (duration === '4 years' || duration === '2 years' || duration === '1 year') && (
            <Typography color={'green'} variant={'description'} mt={2}>
              + Any token airdrop that the ZeroLend protocol will receive.
            </Typography>
          )}
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <LockZeroAction
        mainTxState={mainTxState}
        approvalTxState={approvalTxState}
        isApproved={Number(approvedAmount) !== 0}
        handleLockAction={Number(approvedAmount) === 0 ? approval : createLockHandler}
        text={'Stake ZERO 🚀'}
        loadingText={'Staking ZERO'}
      />
    </>
  );
};
