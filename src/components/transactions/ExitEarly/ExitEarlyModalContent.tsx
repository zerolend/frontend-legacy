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
import { useRootStore } from 'src/store/root';
import { gasLimitRecommendations, ProtocolAction } from '@aave/contract-helpers';
import { GetUserVestingData } from 'src/contract-helpers/types';
import { ExitEarlyAction } from './ExitEarlyAction';
import { normalize } from '@aave/math-utils';
import { ERC20TokenType } from 'src/libs/web3-data-provider/Web3Provider';
import { zeroConfig } from 'src/ui-config/zeroConfig';

interface IProps {
  icon: string;
  vest: GetUserVestingData | undefined;
}

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

export const ExitEarlyModalContent = (props: IProps) => {
  const { icon, vest } = props;
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

  const [addTransaction, claimSingleVestReward] = useRootStore((state) => [
    state.addTransaction,
    state.claimSingleVestReward,
  ]);

  const createExitHandler = async () => {
    try {
      setMainTxState({ ...mainTxState, loading: true });
      const tx = claimSingleVestReward({ tokenId: vest?.id || 0 });
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
        action: 'Stake',
        txState: 'success',
        asset: `VESTID#${vest?.id}`,
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

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }
  if (mainTxState.success)
    return (
      <TxSuccessView
        action={<Trans>Exit Early</Trans>}
        amount={amountRef.current}
        symbol={icon}
        addToken={addToken}
      />
    );

  if (props?.vest?.id === undefined || vest?.id === undefined) return <div />;

  return (
    <>
      <TxModalTitle
        title={`${
          !props.vest.penalty.eq(0) && props.vest.hasPenalty ? 'Exit Early' : 'Claim $ZERO'
        }`}
      />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={currentChainId} />
      )}
      <TxModalDetails gasLimit={gasLimit}>
        <DetailsNumberLine
          description={'VEST ID'}
          numberPrefix={'#'}
          value={vest.id}
          visibleDecimals={0}
        />
        {props.vest.penalty.gt(0) && props.vest.hasPenalty && (
          <DetailsNumberLine
            description={'Penalty'}
            value={normalize(vest.penalty.toString(), 18)}
            iconSymbol={icon}
            visibleDecimals={0}
          />
        )}
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <ExitEarlyAction
        mainTxState={mainTxState}
        approvalTxState={approvalTxState}
        isApproved={true}
        handleLockAction={createExitHandler}
        vest={props.vest}
      />
    </>
  );
};
