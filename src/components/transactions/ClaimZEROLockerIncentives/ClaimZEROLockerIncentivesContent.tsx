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
import { ClaimZEROLockerIncentivesAction } from './ClaimZEROLockerIncentivesActions';
import { normalize } from '@aave/math-utils';
import { ERC20TokenType } from 'src/libs/web3-data-provider/Web3Provider';
import { zeroConfig } from 'src/ui-config/zeroConfig';

export enum ErrorType {
  ALREADY_STAKE,
}

interface IProps {
  amount: string;
}

export const ClaimZEROLockerIncentivesContent = (props: IProps) => {
  const { amount } = props;
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

  const networkConfig = getNetworkConfig(currentChainId);

  const [addTransaction, claimStakingReward, zeroPrice] = useRootStore((state) => [
    state.addTransaction,
    state.claimStakingReward,
    state.oraclePrice,
  ]);

  const claimVestedTokenHandler = async () => {
    try {
      setMainTxState({ ...claimRewardsTxState, loading: true });

      const tx = claimStakingReward();
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
      setMainTxState({ txHash: undefined, loading: false });
    }
  };

  const addToken: ERC20TokenType = {
    address: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
    symbol: 'ZERO',
    decimals: 18,
    aToken: false,
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
  if (claimRewardsTxState.success)
    return <TxSuccessView action={<Trans>Staked</Trans>} addToken={addToken} />;

  //token usd value
  const amountInUsd = zeroPrice && ((zeroPrice / 1e8) * Number(amount)).toString();

  return (
    <>
      <TxModalTitle title="Claim Staking Rewards" />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={currentChainId} />
      )}

      <TxModalDetails gasLimit={gasLimit}>
        <DetailsNumberLine
          description={'Claimable Amount'}
          value={amount && normalize(amount, 18)}
          symbol={'ZERO'}
          usdValue={normalize(amountInUsd, 18)}
        />
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <ClaimZEROLockerIncentivesAction
        mainTxState={claimRewardsTxState}
        approvalTxState={approvalTxState}
        isApproved={true}
        handleLockAction={claimVestedTokenHandler}
        isClaimable={Number(amount) > 0}
      />
    </>
  );
};
