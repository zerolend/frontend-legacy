import { normalize, normalizeBN } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Button, Link, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { ConvertGravityActions } from './ConvertGravityActions';
import { gasLimitRecommendations, ProtocolAction } from '@aave/contract-helpers';
import { Warning } from '../../primitives/Warning';
import { Box } from '@mui/system';
import { DurationBonusMapping, futureDate, IDurations } from '../../../modules/lock/ZeroLock';
import { FormattedNumber } from '../../primitives/FormattedNumber';
import { GravityMerkleDataType } from 'src/modules/rewards/ZEROAirdrop';
import { useRootStore } from 'src/store/root';
import useGetIsClaimed from 'src/hooks/reward/useGetIsClaimed';
import { zeroConfig } from 'src/ui-config/zeroConfig';

export type StakeProps = {
  stakeAssetName: string;
  icon: string;
  merkleData: GravityMerkleDataType | undefined;
};

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

const Durations: IDurations[] = ['1 year', '4 years'];

export const ConvertGravityModalContent = ({ icon, merkleData }: StakeProps) => {
  const {
    chainId: connectedChainId,
    readOnlyModeAddress,
    sendTx,
    currentAccount,
  } = useWeb3Context();
  const { gasLimit, mainTxState, txError, setMainTxState, approvalTxState, setGasLimit } =
    useModalContext();
  const { currentChainId } = useProtocolDataContext();
  const [lockNStake, setLockNStake] = useState<boolean>(false);
  const [duration, setDuration] = useState<IDurations>('4 years');
  const { data: isClaimed } = useGetIsClaimed();

  function calculateFundTransfer() {
    if (!merkleData) return { directT: '0', vestT: '0', bonus: '0' };
    if (isClaimed) return { directT: '0', vestT: '0', bonus: '0' };

    let bonusValue: string;

    const directT = normalizeBN(merkleData?.data.amount || '', 18)
      .multipliedBy(40)
      .dividedBy(100)
      .toString();

    const vestT = normalizeBN(merkleData?.data.amount || '', 18)
      .multipliedBy(60)
      .dividedBy(100)
      .toString();

    if (duration === '1 year')
      bonusValue = normalizeBN(merkleData?.data.amount || '', 18)
        .multipliedBy(5)
        .dividedBy(100)
        .toString();
    else
      bonusValue = normalizeBN(merkleData?.data.amount || '', 18)
        .multipliedBy(20)
        .dividedBy(100)
        .toString();

    return { directT: directT, vestT: vestT, bonus: bonusValue };
  }

  // usd value
  function getUSDValue(value: string) {
    return normalizeBN(value, 18).multipliedBy(25).div(100000).toString();
  }

  // states
  const amountRef = useRef<string>();

  const calculateDuration: number = useMemo(() => {
    if (!lockNStake) return 0;

    if (duration === '4 years') return 4 * 365 * 86400;
    else if (duration === '2 years') return 2 * 365 * 86400;
    else return 1 * 365 * 86400;
  }, [duration]);

  const isWrongNetwork = connectedChainId !== currentChainId;

  const networkConfig = getNetworkConfig(currentChainId);

  const [addTransaction, claimAirdrop] = useRootStore((state) => [
    state.addTransaction,
    state.claimAirdrop,
  ]);

  const createClaimHandler = async () => {
    try {
      if (!merkleData) return;
      setMainTxState({ ...mainTxState, loading: true });
      const tx = claimAirdrop({
        user: merkleData?.data.account,
        claimAmount: merkleData?.data.amount,
        merkleProof: merkleData?.proofs,
        stakeNFT: lockNStake,
        lockUntil: calculateDuration,
      });
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
        amount: merkleData?.data.amount,
      });
    } catch (error) {
      console.log(error);
      setMainTxState({
        txHash: undefined,
        loading: false,
      });
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

  const { directT, vestT, bonus } = calculateFundTransfer();

  return (
    <>
      <TxModalTitle title="Claim Airdrop" />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={currentChainId} />
      )}

      <Box display="flex" alignItems={'center'} justifyContent={'space-between'} mb={4}>
        <Box display="flex">
          <Typography variant="h4">Total Claimable Amount</Typography>
        </Box>
        <FormattedNumber
          value={isClaimed ? 0 : normalize(Number(merkleData?.data.amount), 18)}
          variant="h3"
          symbol="ZERO"
        />
      </Box>

      <Box mb={4}>
        <Typography component={'div'} mb={2}>
          Lock Length
        </Typography>
        <Box display={'flex'}>
          <Box flex={1} px={1}>
            <Button
              variant={!lockNStake ? 'contained' : 'outlined'}
              fullWidth
              onClick={() => setLockNStake(false)}
            >
              Vesting
            </Button>
          </Box>
          {Durations.map((_d, index) => {
            return (
              <Box flex={1} px={1} key={index}>
                <Button
                  variant={duration === _d && lockNStake ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => {
                    setLockNStake(true);
                    setDuration(_d);
                  }}
                >
                  {_d}
                </Button>
                {DurationBonusMapping[_d] && (
                  <Typography
                    variant="description"
                    color={'green'}
                    textAlign={'center'}
                    mt={1}
                    key={index}
                    fontSize={12}
                    fontWeight={duration === _d && lockNStake ? '600' : '300'}
                  >
                    {DurationBonusMapping[_d].text}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
      <TxModalDetails gasLimit={gasLimit} removePaddingTop={true}>
        {lockNStake ? (
          <>
            <DetailsNumberLine
              description={'Direct Transfer'}
              value={directT}
              symbol={icon}
              usdValue={getUSDValue(directT)}
            />
            <DetailsNumberLine
              description={'Lock Amount'}
              value={vestT}
              symbol={icon}
              usdValue={getUSDValue(vestT)}
            />
            <DetailsInfoLine description={'Bonus'} value={bonus} />
            <DetailsInfoLine description={'Locked Until'} value={futureDate(duration)} />
            <DetailsInfoLine description={'Stake'} value={'True'} />
          </>
        ) : (
          <>
            <DetailsNumberLine
              description={'Direct Transfer'}
              value={directT}
              symbol={icon}
              usdValue={getUSDValue(directT)}
            />
            <DetailsNumberLine
              description={'Vesting Amount'}
              value={vestT}
              symbol={icon}
              usdValue={getUSDValue(vestT)}
            />
            <DetailsInfoLine description={'Cliff Duration Period'} value={'3 Months'} />
            <DetailsInfoLine description={'Linear Vesting'} value={'3 Months '} />
          </>
        )}
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <Box mt={8}>
        <Warning severity="info" sx={{ mb: 2 }}>
          <Typography variant="caption">
            If you lock and stake for more than or equal to 1yrs then you would be eligible 10%
            staking bonus amount &nbsp;
            <Link href="https://discord.gg/zerolend" underline="always">
              <Trans>Learn more</Trans>
            </Link>
          </Typography>
        </Warning>
        <Warning severity="info" sx={{ mb: 2 }}>
          <Typography variant="caption">
            If you lock and stake for more than or equal to 1yrs then you would be eligible for
            potential future &nbsp; airdrops &nbsp;
            <Link href="https://discord.gg/zerolend" underline="always">
              <Trans>Learn more</Trans>
            </Link>
          </Typography>
        </Warning>
        <ConvertGravityActions
          isWrongNetwork={isWrongNetwork}
          mainTxState={mainTxState}
          approvalTxState={approvalTxState}
          handleVestAction={createClaimHandler}
          isApproved={true}
          isClaimed={isClaimed ?? false}
          text={lockNStake ? 'Lock & Stake ZERO' : 'Vest ZERO'}
        />
      </Box>
    </>
  );
};
