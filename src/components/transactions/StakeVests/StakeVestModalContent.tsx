import { Trans } from '@lingui/macro';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

import { TxErrorView } from '../FlowCommons/Error';
import { GasEstimationError } from '../FlowCommons/GasEstimationError';
import { TxSuccessView } from '../FlowCommons/Success';
import { DetailsInfoLine, DetailsNumberLine, TxModalDetails } from '../FlowCommons/TxModalDetails';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { ChangeNetworkWarning } from '../Warnings/ChangeNetworkWarning';
import { StakeVestAction } from './StakeVestAction';
import { GetUserVestingData } from 'src/contract-helpers/types';
import { DurationBonusMapping, futureDate, IDurations } from 'src/modules/lock/ZeroLock';
import { Box, Button, Typography } from '@mui/material';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { normalize } from '@aave/math-utils';
import { useRootStore } from 'src/store/root';
import { gasLimitRecommendations, ProtocolAction } from '@aave/contract-helpers';
import { Warning } from '../../primitives/Warning';
import { useGetRewardRateValue } from '../../../hooks/useGetRewardRateValue';
import { BigNumber } from 'ethers';

export enum ErrorType {
  ALREADY_STAKE,
}

interface IProps {
  icon: string;
  vest: GetUserVestingData;
}

const Durations: IDurations[] = ['1 year', '2 years', '4 years'];

export const StakeVestModalContent = (props: IProps) => {
  const { vest, icon } = props;
  const {
    chainId: connectedChainId,
    readOnlyModeAddress,
    sendTx,
    currentAccount,
  } = useWeb3Context();
  const { gasLimit, mainTxState, txError, setMainTxState, approvalTxState, setGasLimit } =
    useModalContext();
  const [duration, setDuration] = useState<IDurations>('4 years');
  const [stake] = useState<boolean>(true);

  const amountRef = useRef<string>();

  const isWrongNetwork = connectedChainId !== 59144;

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
    const amount = normalize(vest.unClaimed.toString(), 18);
    let amountBonus = Number(amount);
    if (DurationBonusMapping[duration]) {
      amountBonus = Number(amount) + (Number(amount) * DurationBonusMapping[duration].perc) / 100;
    }
    return (seconds / 126144000) * amountBonus;
  }, [vest.unClaimed, duration]);

  const e18 = BigNumber.from(10).pow(18);
  const apr = useGetRewardRateValue(
    e18.mul(Math.floor(veZeroCalc)),
    e18.mul(Math.floor(Number(normalize(vest.unClaimed.toString(), 18))))
  );

  const [addTransaction, stakeVestNFT] = useRootStore((state) => [
    state.addTransaction,
    state.stakeVestNFT,
  ]);

  const createLockHandler = async () => {
    try {
      setMainTxState({ ...mainTxState, loading: true });
      const tx = stakeVestNFT({ nftId: vest.id, duration: calculateDuration, stakeNFT: stake });
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
        asset: `VESTID#${vest.id}`,
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
      <TxSuccessView
        action={<Trans>Locked</Trans>}
        amount={amountRef.current}
        symbol={icon}
        joinDiscord={true}
      />
    );

  return (
    <>
      <TxModalTitle title="Stake Unvested Tokens" />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={'Linea'} chainId={59144} />
      )}

      <Box display="flex" alignItems={'center'} justifyContent={'space-between'} mb={4}>
        <Box display="flex">
          <Typography variant="h4">Total Vested Tokens</Typography>
        </Box>
        <FormattedNumber
          value={normalize(vest.unClaimed.toString(), 18)}
          variant="h3"
          symbol="ZERO"
        />
      </Box>

      <Box mb={4}>
        <Typography component={'div'} mb={2}>
          Lock Length
        </Typography>
        <Box display={'flex'}>
          {Durations.map((_d, index) => {
            return (
              <Box flex={1} px={1} key={index}>
                <Button
                  variant={duration === _d ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => {
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
                    fontWeight={duration === _d ? '600' : '300'}
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
        <DetailsNumberLine
          description={'Lock Amount'}
          value={normalize(vest.unClaimed.toString(), 18)}
          symbol={icon}
        />
        <DetailsInfoLine
          description={'ZERO Bonus'}
          value={DurationBonusMapping[duration] ? `${DurationBonusMapping[duration].text}` : '-'}
        />
        <DetailsInfoLine description={'Voting Power'} value={`${veZeroCalc.toFixed(2)}veZERO`} />
        <DetailsInfoLine description={'APR'} value={`${(apr * 100).toFixed(2)}%`} />
        <DetailsInfoLine description={'Locked Until'} value={futureDate(duration)} />
      </TxModalDetails>

      <Warning severity="info" sx={{ mb: 2 }}>
        <Typography variant="caption">
          Vest holders can stake their vested tokens and enjoy staking benefits without having to
          wait for the vested tokens to become claimable.
        </Typography>
      </Warning>

      {txError && <GasEstimationError txError={txError} />}

      {/*Vest holders can stake their vested tokens and enjoy staking benefits without having to wait for the vested tokens to become claimable.*/}
      <StakeVestAction
        mainTxState={mainTxState}
        approvalTxState={approvalTxState}
        isApproved={true}
        handleLockAction={createLockHandler}
      />
    </>
  );
};
