import Box from '@mui/material/Box';
import React, { useMemo, useState } from 'react';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { AssetInput } from '../../components/transactions/AssetInput';
import { Trans } from '@lingui/macro';
import { Button, Link, Typography } from '@mui/material';
import useGetTokenBalance from 'src/hooks/tokens/useGetTokenBalance';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';
import { ChangeNetworkWarning } from 'src/components/transactions/Warnings/ChangeNetworkWarning';
import { useModalContext } from 'src/hooks/useModal';
import { normalizeBN } from '@aave/math-utils';
import dayjs from 'dayjs';
import { Warning } from '../../components/primitives/Warning';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { ChainId } from '@aave/contract-helpers';
// import { GetZEROButton } from '../../components/GetZEROButton';
import { useRootStore } from 'src/store/root';
import { useGetRewardRateValue } from 'src/hooks/useGetRewardRateValue';
import { zeroConfig } from 'src/ui-config/zeroConfig';
import { BigNumber } from 'ethers';

export type IDurations = '3 months' | '6 months' | '1 year' | '2 years' | '4 years';

const Durations: IDurations[] = ['3 months', '6 months', '1 year', '2 years', '4 years'];

export function futureDate(duration: IDurations): string {
  let seconds = 0;
  const secondsInWeek = 604800;

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

  const currentTimestamp = Date.now() / 1000;
  const unlockTime = dayjs.unix(currentTimestamp).add(seconds, 'second').unix();

  const roundedTime = Math.floor(unlockTime / secondsInWeek) * secondsInWeek;

  return dayjs.unix(roundedTime).format('DD-MM-YYYY');
}

export const DurationBonusMapping: { [key: string]: { perc: number; text: string } } = {
  '1 year': {
    perc: 5,
    text: '+5% bonus',
  },
  '2 years': {
    perc: 10,
    text: '+10% bonus',
  },
  '3 years': {
    perc: 15,
    text: '+15% bonus',
  },
  '4 years': {
    perc: 20,
    text: '+20% bonus',
  },
};

const ZeroLock = () => {
  const LineaChainId = 59144 as ChainId;
  const networkConfig = getNetworkConfig(LineaChainId);
  const { chainId: connectedChainId, readOnlyModeAddress } = useWeb3Context();
  const [amount, setAmount] = useState<string>('');
  const [duration, setDuration] = useState<IDurations>('4 years');
  const { openLockZeroModal } = useModalContext();
  const usdValue = useRootStore((store) => store.oraclePrice);

  const zeroBal = useGetTokenBalance(
    zeroConfig.crossChainAddresses[zeroConfig.chainId].ZERO_ADDRESS
  );
  const isWrongNetwork = LineaChainId !== connectedChainId;

  const isMaxSelected = amount === normalizeBN(zeroBal.toString(), 18).toString();

  const handleChange = (_value: string) => {
    if (_value === '-1') {
      setAmount(normalizeBN(zeroBal.toString(), 18).toString());
    } else {
      setAmount(_value);
    }
  };

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
    let amountBonus = Number(amount);
    if (DurationBonusMapping[duration]) {
      amountBonus = Number(amount) + (Number(amount) * DurationBonusMapping[duration].perc) / 100;
    }
    return (seconds / 126144000) * amountBonus;
  }, [amount, duration]);

  const e18 = BigNumber.from(10).pow(18);
  const apr = useGetRewardRateValue(
    e18.mul(Math.floor(veZeroCalc)),
    e18.mul(Math.floor(Number(amount)))
  );

  const showBonusInfo = useMemo(() => !duration.includes('year'), [duration]);
  const showLongerInfoInfo = useMemo(() => duration != '4 years', [duration]);

  //token usd value
  const amountInUsd = usdValue && ((usdValue / 1e8) * Number(amount)).toString();

  return (
    <ListWrapper
      titleComponent={
        <Box>
          <Typography component="p" variant="h3" sx={{ mr: 4 }}>
            <Trans>Stake ZERO</Trans>
          </Typography>
          <Typography component="p" variant="description" sx={{ mr: 4 }} color={'text.muted'}>
            <Trans>
              Stake $ZERO tokens to receive voting power, staking rewards, and potential future
              airdrops from other protocols.
            </Trans>
            {/* <GetZEROButton/> */}
          </Typography>
        </Box>
      }
    >
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={LineaChainId} />
      )}
      <Box px={6} pb={6}>
        <Box mb={4}>
          <AssetInput
            value={amount}
            onChange={handleChange}
            usdValue={amountInUsd || ''}
            symbol={'ZERO'}
            assets={[
              {
                balance: normalizeBN(zeroBal.toString(), 18).toString(),
                symbol: 'ZERO',
                iconSymbol: 'ZERO',
              },
            ]}
            isMaxSelected={isMaxSelected}
            disabled={false}
            maxValue={normalizeBN(zeroBal.toString(), 18).toString()}
            balanceText={<Trans>Wallet balance</Trans>}
          />
        </Box>
        <Box mb={4}>
          <Typography component={'h4'} mb={2}>
            Lock Duration
          </Typography>
          <Box display={'flex'}>
            {Durations.map((_d, index) => {
              return (
                <Box flex={1} px={1} key={index}>
                  <Button
                    variant={duration === _d ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => setDuration(_d)}
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
        <Box height={'1px'} my={6} bgcolor={'lightGray'}></Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
          <Typography component={'div'} variant={'h4'}>
            Staking Bonus
          </Typography>
          <Typography component={'div'}>
            {DurationBonusMapping[duration] ? `${DurationBonusMapping[duration].text}` : '-'}
          </Typography>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
          <Typography component={'div'} variant={'h4'}>
            Voting Power
          </Typography>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography component={'span'}>~</Typography>
            <FormattedNumber value={veZeroCalc} symbol={'veZERO'} />
          </Box>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
          <Typography component={'div'} variant={'h4'}>
            APR
          </Typography>
          <FormattedNumber value={apr} percent={true} />
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
          <Typography component={'div'} variant={'h4'}>
            Lock Until
          </Typography>
          <Typography component={'div'}>{futureDate(duration)}</Typography>
        </Box>
        <Box mt={4}>
          {showBonusInfo && (
            <Warning severity="info" sx={{ mb: 2 }}>
              <Typography variant="caption">
                If you lock and stake for 1-4 years, then you would be eligible 5-20% bonus{' '}
                {/* <Link href="https://discord.gg/zerolend" underline="always">
                  <Trans>Learn more</Trans>
                </Link> */}
              </Typography>
            </Warning>
          )}
          {showLongerInfoInfo && (
            <Warning severity="info" sx={{ mb: 2 }}>
              <Typography variant="caption">
                The longer you stake, the more voting power, rewards and airdrops you receive. Users
                also receive a staking bonus for staking more than 1 year{' '}
                <Link
                  href="https://docs.zerolend.xyz/governance/token-overview/staking"
                  underline="always"
                >
                  Learn more.
                </Link>
              </Typography>
            </Warning>
          )}
          {/* <Grid container spacing={2}> */}
          <Button
            variant="contained"
            fullWidth
            disabled={amount === '' || isWrongNetwork || Number(amount) === 0}
            onClick={() => openLockZeroModal(amount, duration, true, apr.toFixed(2))}
          >
            Stake
          </Button>
          {/* </Grid> */}
        </Box>
      </Box>
    </ListWrapper>
  );
};

export default ZeroLock;
