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
import { UnstakeZeroAction } from './UnstakeZeroAction';
import { useRootStore } from 'src/store/root';
import { ProtocolAction, gasLimitRecommendations } from '@aave/contract-helpers';
import { zeroConfig } from 'src/ui-config/zeroConfig';

export type UnstakeZeroProps = {
  icon: string;
  lockId: number;
};

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

export const UnstakeZeroModalContent = ({ icon, lockId }: UnstakeZeroProps) => {
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

  const [addTransaction, unStakeNFT] = useRootStore((state) => [
    state.addTransaction,
    state.unStakeNFT,
  ]);

  const withdrawLockHandler = async () => {
    try {
      setMainTxState({ ...mainTxState, loading: true });

      const tx = unStakeNFT({ nftId: lockId });
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
        action: 'Unstake',
        txState: 'success',
        asset: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
        amount: '',
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
      <TxModalTitle title="Unstake" symbol={icon} />
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
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <UnstakeZeroAction
        mainTxState={mainTxState}
        approvalTxState={approvalTxState}
        isApproved={true}
        handleLockAction={withdrawLockHandler}
      />
    </>
  );
};
