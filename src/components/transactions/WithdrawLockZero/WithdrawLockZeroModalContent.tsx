import { Trans } from '@lingui/macro';
import React, { useEffect, useRef } from 'react';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';

import { TxErrorView } from '../FlowCommons/Error';
import { GasEstimationError } from '../FlowCommons/GasEstimationError';
import { TxSuccessView } from '../FlowCommons/Success';
import { DetailsNumberLine, TxModalDetails } from '../FlowCommons/TxModalDetails';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { ChangeNetworkWarning } from '../Warnings/ChangeNetworkWarning';
import { WithdrawLockZeroAction } from './WithdrawLockZeroAction';
import { useRootStore } from 'src/store/root';
import { ProtocolAction, gasLimitRecommendations } from '@aave/contract-helpers';
import { normalize } from '@aave/math-utils';
import { zeroConfig } from 'src/ui-config/zeroConfig';

export type WithdrawLockZeroProps = {
  icon: string;
  lockId: number;
  lockAmount: string;
};

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

export const WithdrawLockZeroModalContent = ({
  icon,
  lockId,
  lockAmount,
}: WithdrawLockZeroProps) => {
  const {
    chainId: connectedChainId,
    readOnlyModeAddress,
    sendTx,
    currentAccount,
  } = useWeb3Context();
  const { gasLimit, mainTxState, txError, setMainTxState, approvalTxState, setGasLimit } =
    useModalContext();
  const { currentChainId } = useProtocolDataContext();

  const amountRef = useRef<string>();

  const isWrongNetwork = connectedChainId !== currentChainId;

  const networkConfig = getNetworkConfig(currentChainId);

  const [addTransaction, unStakeWithdraw, unStakeWithdrawLP] = useRootStore((state) => [
    state.addTransaction,
    state.unStakeWithdraw,
    state.unStakeWithdrawLP,
  ]);

  const withdrawLockHandler = async () => {
    try {
      setMainTxState({ ...mainTxState, loading: true });
      let tx;

      if (icon === 'ZERO') {
        tx = unStakeWithdraw({ nftId: lockId });
      } else {
        tx = unStakeWithdrawLP({ nftId: lockId });
      }
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
        action: 'Withdraw Lock',
        txState: 'success',
        asset: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
        amount: lockAmount,
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
    setGasLimit(supplyGasLimit.toString());
  }, [approvalTxState, setGasLimit]);

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }
  if (mainTxState.success)
    return (
      <TxSuccessView action={<Trans>Locked</Trans>} amount={amountRef.current} symbol={icon} />
    );

  return (
    <>
      <TxModalTitle title="Withdraw Lock" symbol={icon === 'ZERO' ? 'ZERO' : 'ZERO/ETH'} />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={currentChainId} />
      )}
      <TxModalDetails gasLimit={gasLimit}>
        <DetailsNumberLine
          description={'LOCK ID'}
          numberPrefix={'#'}
          value={lockId}
          visibleDecimals={0}
        />
        <DetailsNumberLine
          description={'LOCK Amount'}
          value={normalize(lockAmount, 18)}
          symbol={icon === 'ZERO' ? 'ZERO' : 'ZERO/ETH'}
          visibleDecimals={0}
        />
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <WithdrawLockZeroAction
        mainTxState={mainTxState}
        approvalTxState={approvalTxState}
        isApproved={true}
        handleLockAction={withdrawLockHandler}
        text={`Withdraw ${icon === 'ZERO' ? 'ZERO' : 'ZERO/ETH'}`}
        loadingText={`Withdrawing ${icon === 'ZERO' ? 'ZERO' : 'ZERO/ETH'}`}
      />
    </>
  );
};
