import { Trans } from '@lingui/macro';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { StakeZeroAction } from './StakeZeroAction';
import { useRootStore } from 'src/store/root';
import { APPROVAL_GAS_LIMIT } from '../utils';
import { ProtocolAction, gasLimitRecommendations } from '@aave/contract-helpers';
import { zeroConfig } from 'src/ui-config/zeroConfig';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export type StakeProps = {
  icon: string;
  nftId: number;
};

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

export const StakeZeroModalContent = ({ icon, nftId }: StakeProps) => {
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
  const [approvedAddress, setApprovedAddress] = useState<string>('');
  const [requiresApproval, setRequiresApproval] = useState<boolean>(false);

  const amountRef = useRef<string>();

  const isWrongNetwork = connectedChainId !== currentChainId;

  const networkConfig = getNetworkConfig(currentChainId);

  const [generateNFTAllowance, estimateGasLimit, addTransaction, approveNFT, stakeNFT] =
    useRootStore((state) => [
      state.generateNFTAllowance,
      state.estimateGasLimit,
      state.addTransaction,
      state.approveNFT,
      state.stakeNFT,
    ]);

  // callback to fetch approved amount and determine execution path on dependency updates
  const fetchApprovedAmount = useCallback(
    async (forceApprovalCheck?: boolean) => {
      // Check approved amount on-chain on first load or if an action triggers a re-check such as an approval being confirmed
      if (!approvedAddress || forceApprovalCheck) {
        const approvedCheck = await generateNFTAllowance({
          nftId: nftId,
        });
        setApprovedAddress(approvedCheck);
      }
      if (approvedAddress === NULL_ADDRESS) {
        setRequiresApproval(true);
        setApprovalTxState({});
      } else setRequiresApproval(false);
    },
    [approvedAddress]
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
      if (requiresApproval && approvedAddress === NULL_ADDRESS) {
        let approveTxData = await approveNFT({
          to: zeroConfig.crossChainAddresses[currentChainId].OMNI_STAKING,
          nftId: nftId,
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
          asset: `NFTID#${nftId}`,
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

      const tx = stakeNFT({ nftId });

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
        asset: `NFTID#${nftId}`,
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
      <TxSuccessView action={<Trans>Locked</Trans>} amount={amountRef.current} symbol={icon} />
    );

  return (
    <>
      <TxModalTitle title="Stake" symbol={icon} />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={currentChainId} />
      )}
      <TxModalDetails gasLimit={gasLimit}>
        <DetailsNumberLine
          description={'NFT ID'}
          numberPrefix={'#'}
          value={nftId}
          visibleDecimals={0}
        />
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <StakeZeroAction
        mainTxState={mainTxState}
        approvalTxState={approvalTxState}
        isApproved={!requiresApproval}
        handleLockAction={requiresApproval ? approval : createLockHandler}
      />
    </>
  );
};
