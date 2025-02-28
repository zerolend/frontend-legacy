import React from 'react';
import { Box } from '@mui/system';
import { Button, Grid, Paper, Typography } from '@mui/material';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { TokenIcon } from '../../components/primitives/TokenIcon';
import { normalize, normalizeBN } from '@aave/math-utils';
import { GetUserVestingData } from 'src/contract-helpers/types';
import dayjs from 'dayjs';
import { useModalContext } from 'src/hooks/useModal';
import { useGetRewardRateValue } from '../../hooks/useGetRewardRateValue';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';
import { ChangeNetworkWarning } from '../../components/transactions/Warnings/ChangeNetworkWarning';

interface IProps {
  vest: GetUserVestingData;
}

const VestRow = (props: IProps) => {
  const { vest } = props;
  const { chainId: connectedChainId, readOnlyModeAddress } = useWeb3Context();
  const { openStakeVestModal, openExitEarly } = useModalContext();
  const isWrongNetwork = connectedChainId !== 59144;

  const apr = useGetRewardRateValue();

  const totalVestAmount =
    Number(normalizeBN(vest.pending.toString(), 18)) +
    Number(normalizeBN(vest.upfront.toString(), 18));
  const totalClaimedAmount =
    Number(normalizeBN(vest.upfrontClaimed.toString(), 18)) +
    Number(normalizeBN(vest.pendingClaimed.toString(), 18));

  const calculateDays = (monthsInSecond: number) => {
    return (monthsInSecond / 86400).toFixed(0);
  };

  return (
    <Paper>
      <Box px={6} py={4} mb={4}>
        <Box display={'flex'} alignItems={'center'} mb={3}>
          <Typography variant={'secondary16'} mr={4}>
            {vest && `Vest#${vest.id.toString()}`}
          </Typography>
          {/*<ListTopInfoItem title={<Trans>{VestCategory[vest.category]}</Trans>} value={''} />*/}
        </Box>
        <Box borderBottom={'1px solid lightGray'} pb={4} mb={4}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant={'secondary16'}>Total Vest Amount</Typography>
            <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
              <FormattedNumber
                value={totalVestAmount}
                variant={'secondary16'}
                fontWeight={600}
                visibleDecimals={2}
                compact={true}
                sx={{ display: 'flex', alignItems: 'baseline' }}
              />
              <TokenIcon symbol={'ZERO'} sx={{ width: 18, height: 18, ml: 1 }} />
            </Box>
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant={'description'} color={'text.muted'}>
              Upfront Tokens
            </Typography>
            <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
              <FormattedNumber
                value={normalizeBN(vest.upfront.toString(), 18).toString()}
                variant={'secondary14'}
                color={'text.muted'}
                visibleDecimals={2}
                compact={true}
                ml={1}
                sx={{ display: 'flex', alignItems: 'baseline' }}
              />
            </Box>
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant={'description'} color={'text.muted'}>
              Vested Tokens
            </Typography>
            <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
              <FormattedNumber
                value={normalizeBN(vest.pending.toString(), 18).toString()}
                variant={'secondary14'}
                color={'text.muted'}
                visibleDecimals={2}
                compact={true}
                ml={1}
                sx={{ display: 'flex', alignItems: 'baseline' }}
              />
            </Box>
          </Box>
        </Box>
        <Box borderBottom={'1px solid lightGray'} pb={4} mb={4}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant={'secondary16'}>Total Vested Days</Typography>
            <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
              <Typography variant="secondary16">{`${calculateDays(
                Number(vest.cliffDuration.toString()) + Number(vest.linearDuration.toString())
              )} days`}</Typography>
              <Typography variant="secondary16" color={'text.muted'}>
                &nbsp;
                {`| until ${dayjs
                  .unix(Number(vest.unlockDate.toString()))
                  .add(Number(vest.cliffDuration.toString()), 'seconds')
                  .add(Number(vest.linearDuration.toString()), 'seconds')
                  .format('DD-MM-YYYY')}`}
              </Typography>
            </Box>
          </Box>
          {/*<Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant={'description'} color={'text.muted'}>
              Start Date
            </Typography>
            <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'}>
              <Typography variant="secondary14" color={'text.muted'}>
                {dayjs.unix(Number(vest.unlockDate.toString())).format('DD-MM-YYYY')}
              </Typography>
            </Box>
          </Box>*/}
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant={'description'} color={'text.muted'}>
              Cliff
            </Typography>
            <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'}>
              <Typography variant="secondary14">{`${calculateDays(
                Number(vest.cliffDuration.toString())
              )} days`}</Typography>
              <Typography variant="secondary14" color={'text.muted'}>
                &nbsp;
                {calculateDays(Number(vest.cliffDuration.toString())) !== '0' &&
                  `| until ${dayjs
                    .unix(Number(vest.unlockDate.toString()))
                    .add(Number(vest.cliffDuration.toString()), 'seconds')
                    .format('DD-MM-YYYY')}`}
              </Typography>
            </Box>
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant={'description'} color={'text.muted'}>
              Vesting (linear)
            </Typography>
            <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'}>
              <Typography variant="secondary14">{`${calculateDays(
                Number(vest.linearDuration.toString())
              )} days`}</Typography>
              <Typography variant="secondary14" color={'text.muted'}>
                &nbsp;
                {`| starts ${dayjs
                  .unix(Number(vest.unlockDate.toString()))
                  .add(Number(vest.cliffDuration.toString()), 'seconds')
                  .format('DD-MM-YYYY')}`}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={2}>
            <Typography variant={'secondary16'}>Claimed Tokens</Typography>
            <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
              <FormattedNumber
                value={totalClaimedAmount}
                variant={'secondary16'}
                fontWeight={600}
                visibleDecimals={2}
                compact={true}
                sx={{ display: 'flex', alignItems: 'baseline' }}
              />
              <TokenIcon symbol={'ZERO'} sx={{ width: 18, height: 18, ml: 1 }} />
            </Box>
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant={'secondary16'}>Unclaimed Tokens</Typography>
            <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
              <FormattedNumber
                value={normalize(vest.claimable.toString(), 18)}
                variant={'secondary16'}
                fontWeight={600}
                visibleDecimals={2}
                compact={true}
                ml={1}
                sx={{ display: 'flex', alignItems: 'baseline' }}
              />
              <TokenIcon symbol={'ZERO'} sx={{ width: 18, height: 18, ml: 1 }} />
            </Box>
          </Box>
          <Box mt={8}>
            {isWrongNetwork && !readOnlyModeAddress && (
              <ChangeNetworkWarning networkName={'Linea'} chainId={59144} />
            )}
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={6} xs={6}>
                <Button
                  variant="contained"
                  onClick={() => {
                    openExitEarly(vest);
                  }}
                  fullWidth
                  disabled={
                    dayjs().unix() < Number(vest.unlockDate) ||
                    (vest.claimable.eq(0) && !vest.hasPenalty) ||
                    isWrongNetwork
                  }
                >
                  {vest.penalty.gt(0) && vest.hasPenalty ? 'Exit Early' : 'Claim ZERO'}
                </Button>
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={6}>
                <Button
                  variant="contained"
                  onClick={() => {
                    openStakeVestModal(vest);
                  }}
                  fullWidth
                  disabled={dayjs().unix() < Number(vest.unlockDate) || isWrongNetwork}
                >
                  Stake Unvested Tokens
                </Button>
                <Box>
                  <Typography
                    variant="description"
                    color={'green'}
                    textAlign={'center'}
                    mt={1}
                    fontSize={12}
                    fontWeight={'600'}
                  >
                    {`Get an additional 20% bonus if you stake`}
                  </Typography>
                  <Typography
                    variant="description"
                    color={'green'}
                    textAlign={'center'}
                    mt={1}
                    fontSize={12}
                    fontWeight={'600'}
                  >
                    {`and a APR of upto ${apr ? (apr * 100).toFixed(2) : '-'}%`}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default VestRow;
