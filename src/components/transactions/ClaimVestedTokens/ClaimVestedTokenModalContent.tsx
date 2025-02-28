import { Trans } from '@lingui/macro';
import { useEffect, useState } from 'react';
import { IVests } from 'src/helpers/types';
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
import { ClaimVestedTokenAction } from './ClaimVestedTokenAction';
import { VestSelect } from './VestSelect';
import { ProtocolAction, gasLimitRecommendations } from '@aave/contract-helpers';
import { useRootStore } from 'src/store/root';
import { zeroConfig } from 'src/ui-config/zeroConfig';

export enum ErrorType {
  ALREADY_STAKE,
}

interface IProps {
  vestId: number;
  claimableAmount: string;
}

export const ClaimVestedTokenModalContent = (props: IProps) => {
  const {
    gasLimit,
    mainTxState: claimRewardsTxState,
    setMainTxState,
    txError,
    setGasLimit,
    approvalTxState,
  } = useModalContext();
  const { currentChainId } = useProtocolDataContext();
  const {
    chainId: connectedChainId,
    readOnlyModeAddress,
    sendTx,
    currentAccount,
  } = useWeb3Context();
  const [selectedVestId, setSelectedVestId] = useState<number>(props.vestId);
  const [vests] = useState<IVests[]>([]);

  const networkConfig = getNetworkConfig(currentChainId);

  const [addTransaction, claimSingleVestReward] = useRootStore((state) => [
    state.addTransaction,
    state.claimSingleVestReward,
  ]);

  const claimVestedTokenHandler = async () => {
    try {
      setMainTxState({ ...claimRewardsTxState, loading: true });

      const tx = claimSingleVestReward({ tokenId: props.vestId });
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
        action: `Claim Vest #${props.vestId} Reward`,
        txState: 'success',
        asset: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
        amount: props.claimableAmount,
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

  // is Network mismatched
  const isWrongNetwork = currentChainId !== connectedChainId;

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }
  if (claimRewardsTxState.success) return <TxSuccessView action={<Trans>Staked</Trans>} />;

  return (
    <>
      <TxModalTitle title="Claim $ZERO Token" />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={currentChainId} />
      )}

      {vests.length > 1 && (
        <VestSelect
          vests={vests}
          selectedVest={selectedVestId}
          setSelectedVest={(vestId) => setSelectedVestId(vestId)}
        />
      )}

      {selectedVestId && (
        <TxModalDetails gasLimit={gasLimit}>
          <DetailsInfoLine description={'Vest ID #'} value={selectedVestId} />
          <DetailsNumberLine
            description={'Claimable Amount'}
            value={props.claimableAmount}
            symbol={'ZERO'}
          />
        </TxModalDetails>
      )}

      {txError && <GasEstimationError txError={txError} />}

      <ClaimVestedTokenAction
        mainTxState={claimRewardsTxState}
        approvalTxState={approvalTxState}
        isApproved={true}
        handleLockAction={claimVestedTokenHandler}
        vestId={props.vestId}
        isClaimable={Number(props.claimableAmount) > 0}
      />
    </>
  );
};
