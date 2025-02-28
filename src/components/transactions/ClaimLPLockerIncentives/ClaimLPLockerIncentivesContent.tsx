import { Trans } from '@lingui/macro';
import { useEffect } from 'react';
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
import { ProtocolAction, gasLimitRecommendations } from '@aave/contract-helpers';
import { useRootStore } from 'src/store/root';
import { ClaimLPLockerIncentivesAction } from './ClaimLPLockerIncentivesActions';
import { USD_DECIMALS, normalize } from '@aave/math-utils';
import { zeroConfig } from 'src/ui-config/zeroConfig';
import BigNumber from 'bignumber.js';
import {
  ComputedReserveData,
  useAppDataContext,
} from 'src/hooks/app-data-provider/useAppDataProvider';
import { TxAction, getErrorTextFromError } from 'src/ui-config/errorMapping';

export enum ErrorType {
  ALREADY_STAKE,
}

interface IProps {
  amount: string;
}

export const ClaimLPLockerIncentivesContent = (props: IProps) => {
  const { amount } = props;
  const { marketReferencePriceInUsd, reserves } = useAppDataContext();

  const {
    gasLimit,
    mainTxState: claimRewardsTxState,
    setMainTxState,
    txError,
    setTxError,
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

  const networkConfig = getNetworkConfig(currentChainId);

  const poolReserve = reserves.find((reserve) => {
    return reserve.isWrappedBaseAsset;
  }) as ComputedReserveData;

  const [addTransaction, claimStakingLPReward] = useRootStore((state) => [
    state.addTransaction,
    state.claimStakingLPReward,
  ]);

  const amountIntEth = new BigNumber(amount).multipliedBy(
    poolReserve.formattedPriceInMarketReferenceCurrency
  );
  const amountInUsd = amountIntEth.multipliedBy(marketReferencePriceInUsd).shiftedBy(-USD_DECIMALS);

  const claimVestedTokenHandler = async () => {
    try {
      setMainTxState({ ...claimRewardsTxState, loading: true });

      const tx = claimStakingLPReward();
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
        action: `Claim Incentives`,
        txState: 'success',
        asset: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
        amount: '',
      });
    } catch (error) {
      console.log('err', error);
      const parsedError = getErrorTextFromError(error, TxAction.GAS_ESTIMATION, false);
      setTxError(parsedError);
      setMainTxState({ txHash: undefined, loading: false });
    }
  };

  // Update gas estimation
  useEffect(() => {
    let supplyGasLimit = 0;
    supplyGasLimit = Number(gasLimitRecommendations[ProtocolAction.default].recommended);
    setGasLimit(supplyGasLimit.toString());
  }, [approvalTxState, setGasLimit]);

  const isWrongNetwork = connectedChainId !== currentChainId;

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }
  if (claimRewardsTxState.success) return <TxSuccessView action={<Trans>Staked</Trans>} />;

  return (
    <>
      <TxModalTitle title="Claim LP Rewards" />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={currentChainId} />
      )}

      <TxModalDetails gasLimit={gasLimit}>
        <DetailsNumberLine
          description={'Claimable Amount'}
          value={amount && normalize(amount, 18)}
          symbol={'ETH'}
          usdValue={normalize(amountInUsd, 18)}
        />
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <ClaimLPLockerIncentivesAction
        mainTxState={claimRewardsTxState}
        approvalTxState={approvalTxState}
        isApproved={true}
        handleLockAction={claimVestedTokenHandler}
        isClaimable={Number(amount) > 0}
      />
    </>
  );
};
