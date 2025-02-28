import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';

import { TxErrorView } from '../FlowCommons/Error';
import { GasEstimationError } from '../FlowCommons/GasEstimationError';
import { TxSuccessView } from '../FlowCommons/Success';
import { DetailsNumberLineWithSub, TxModalDetails } from '../FlowCommons/TxModalDetails';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { ChangeNetworkWarning } from '../Warnings/ChangeNetworkWarning';
import { ClaimZEROVestsActions } from './ClaimZEROVestsActions';
import { VestsSelect } from './VestsSelect';
import { gasLimitRecommendations, ProtocolAction } from '@aave/contract-helpers';
import { useRootStore } from 'src/store/root';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { BigNumber, PopulatedTransaction } from 'ethers';
import { IVestsProps } from 'src/modules/rewards/Vests';
import { normalize } from '@aave/math-utils';
import { zeroConfig } from 'src/ui-config/zeroConfig';

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

export const ClaimZEROVestsContent = (props: IVestsProps) => {
  const { vests } = props;
  const {
    gasLimit,
    mainTxState: claimRewardsTxState,
    txError,
    setGasLimit,
    approvalTxState,
    setMainTxState,
  } = useModalContext();
  const {
    chainId: connectedChainId,
    readOnlyModeAddress,
    currentAccount,
    sendTx,
  } = useWeb3Context();
  const { currentChainId } = useProtocolDataContext();
  const [selectedNFTId, setSelectedVestId] = useState<number>(0);

  const [addTransaction, claimSingleVestReward, claimAllVestRewards] = useRootStore((state) => [
    state.addTransaction,
    state.claimSingleVestReward,
    state.claimAllVestRewards,
  ]);

  const totalVestClaimable = vests && vests.reduce((a, b) => a.add(b.claimable), BigNumber.from(0));

  const claimSelectedVestedTokenHandler = async () => {
    try {
      if (vests === undefined) return;
      setMainTxState({ ...claimRewardsTxState, loading: true });
      let vestIds: number[] = [];
      let tx: Promise<PopulatedTransaction>;

      if (selectedNFTId === 0) {
        vestIds = vests.filter((value) => value.claimable.gt(0)).map((object) => object.id);

        tx = claimAllVestRewards({ tokenIds: vestIds });
      } else {
        const vestId = vests.find((vest) => vest.id.toString() === String(selectedNFTId));

        tx = claimSingleVestReward({ tokenId: vestId?.id ?? 0 });
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
        action: selectedNFTId === 0 ? 'Claim All Vests' : `Claim Vest #${selectedNFTId} Reward`,
        txState: 'success',
        asset: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
      });
    } catch (error) {
      console.log('err', error);
      setMainTxState({ txHash: undefined, loading: false });
    }
  };

  const networkConfig = getNetworkConfig(currentChainId);

  // is Network mismatched
  const isWrongNetwork = currentChainId !== connectedChainId;
  const selectedReward =
    vests && selectedNFTId === 0
      ? undefined
      : vests && vests.find((r) => r.id.toString() === selectedNFTId.toString());

  // Update gas estimation
  useEffect(() => {
    let supplyGasLimit = 0;
    supplyGasLimit = Number(gasLimitRecommendations[ProtocolAction.default].recommended);
    setGasLimit(supplyGasLimit.toString());
  }, [approvalTxState, setGasLimit]);

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }
  if (claimRewardsTxState.success) return <TxSuccessView action={<Trans>Staked</Trans>} />;

  if (vests.length === 0) {
    return (
      <>
        <TxModalTitle title="Claim Unlocked $ZERO" />
        <Typography color="error.main">
          <Trans>Your claimable balance is 0</Trans>
        </Typography>
      </>
    );
  }

  return (
    <>
      <TxModalTitle title="Claim Unlocked $ZERO" />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={currentChainId} />
      )}

      {vests && vests.length > 1 && (
        <VestsSelect
          nfts={vests}
          selectedNFT={selectedNFTId === 0 ? '0' : selectedNFTId.toString()}
          setSelectedNFT={(key) => {
            setSelectedVestId(Number(key));
          }}
        />
      )}

      <TxModalDetails gasLimit={gasLimit}>
        {selectedNFTId === 0 && (
          <>
            {vests &&
              vests
                .filter((value) => value.claimable.gt(0))
                .map((vest, index) => {
                  return (
                    <Row
                      caption={<Trans>{`Vest #${vest.id.toString()}`}</Trans>}
                      captionVariant="description"
                      align="flex-start"
                      mb={selectedNFTId !== 0 ? 0 : 4}
                      key={index}
                    >
                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
                      >
                        <Box
                          key={`claim-${vest.id.toString()}`}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            mb: 4,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography ml={1} variant="secondary14"></Typography>
                            <FormattedNumber
                              value={normalize(vest.claimable.toString(), 18)}
                              variant="secondary14"
                              symbol={'ZERO'}
                            />
                          </Box>
                          <FormattedNumber
                            value={normalize(vest.claimable.toString(), 18)} //usd value of claimable amount
                            variant="helperText"
                            compact
                            symbol="USD"
                            color="text.secondary"
                          />
                        </Box>
                      </Box>
                    </Row>
                  );
                })}
          </>
        )}
        {selectedNFTId !== 0 && selectedReward && (
          <DetailsNumberLineWithSub
            symbol={<TokenIcon symbol={'ZERO'} />}
            futureValue={normalize(selectedReward.claimable.toString(), 18)}
            futureValueUSD={normalize(selectedReward.claimable.toString(), 18)}
            description={<Trans>{`Vest #${selectedReward.id.toString()}`} Claimable Amount</Trans>}
          />
        )}
        {selectedNFTId === 0 && (
          <DetailsNumberLineWithSub
            symbol={<TokenIcon symbol={'ZERO'} />}
            futureValue={normalize(totalVestClaimable.toString(), 18)}
            futureValueUSD={normalize(totalVestClaimable.toString(), 18)}
            description={<Trans> Total Claimable Amount</Trans>}
          />
        )}
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <ClaimZEROVestsActions
        mainTxState={claimRewardsTxState}
        approvalTxState={approvalTxState}
        isApproved={true}
        handleLockAction={claimSelectedVestedTokenHandler}
        vestId={selectedNFTId}
        isVests={vests.length > 0}
        isClaimableSufficient={selectedNFTId !== 0 ? selectedReward?.claimable.gt(0) : true}
      />
    </>
  );
};
