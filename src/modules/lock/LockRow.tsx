import React from 'react';
import { Box } from '@mui/system';
import { Button, Grid, Typography } from '@mui/material';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { TokenIcon } from '../../components/primitives/TokenIcon';
import { GetUserLockData } from 'src/contract-helpers/types';
import dayjs from 'dayjs';
import { normalize, normalizeBN } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { ListWrapper } from '../../components/lists/ListWrapper';
import { useModalContext } from 'src/hooks/useModal';

interface IProps {
  kind: 'lp' | 'token';
  lock: GetUserLockData;
  icon: string;
}

const LockRow = (props: IProps) => {
  const { openWithdrawLockZeroModal } = useModalContext();

  return (
    <ListWrapper
      titleComponent={
        <Typography component="div" variant="h3" sx={{ mr: 4 }}>
          <Trans>
            {props.lock.type === 'nft'
              ? `NFT #${props.lock.id}`
              : `${props.kind === 'lp' ? 'LP' : 'Token'} Lock #${props.lock.id}`}
          </Trans>
        </Typography>
      }
      localStorageName={`Lock#${props.lock.id}`}
      withBottomMargin
    >
      <Box px={6}>
        <Box mb={4} pb={4}>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Box>
                <Box mb={7}>
                  <Typography variant={'description'} color={'text.muted'} mb={2}>
                    Amount Locked
                  </Typography>
                  <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'}>
                    <TokenIcon symbol={props.icon} sx={{ width: 24 }} />
                    <FormattedNumber
                      value={
                        props.lock.amount &&
                        normalizeBN(props.lock.amount.toString(), 18).toString()
                      }
                      variant={'secondary21'}
                      visibleDecimals={2}
                      compact={true}
                      ml={1}
                      sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        ml: props.kind === 'lp' ? 3 : 0,
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant={'description'} color={'text.muted'} mb={2}>
                  Lock End Date
                </Typography>
                <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'}>
                  <Typography variant="secondary21">
                    {dayjs.unix(Number(props.lock.end.toString())).format('DD-MM-YYYY')}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Box>
                <Box mb={7}>
                  <Typography variant={'description'} color={'text.muted'} mb={2}>
                    APR
                  </Typography>
                  <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'}>
                    <FormattedNumber
                      value={normalize(props.lock.apr.mul(100).toString(), 18).toString()}
                      symbol={`% ${props.kind === 'lp' ? 'ETH' : 'ZERO'} `}
                      variant={'secondary21'}
                      symbolsVariant={'secondary16'}
                      visibleDecimals={2}
                      compact={true}
                      ml={1}
                      sx={{ display: 'flex', alignItems: 'baseline' }}
                    />
                  </Box>
                </Box>
                <Typography variant={'description'} color={'text.muted'} mb={2}>
                  Voting Power
                </Typography>
                <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'}>
                  <FormattedNumber
                    value={normalizeBN(props.lock.power.toString(), 18).toString()}
                    variant={'secondary21'}
                    symbolsVariant={'secondary16'}
                    visibleDecimals={2}
                    symbol={'veZERO'}
                    // symbol={'veZERO'}
                    compact={true}
                    ml={1}
                    sx={{ display: 'flex', alignItems: 'baseline' }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box mt={8}>
            <Button
              variant="contained"
              onClick={() => {
                openWithdrawLockZeroModal(props.icon, props.lock.id, props.lock.amount.toString());
              }}
              fullWidth
              disabled={dayjs().valueOf() < props.lock.end.toNumber() * 1000}
            >
              Withdraw
            </Button>
          </Box>
        </Box>
      </Box>
    </ListWrapper>
  );
};

export default LockRow;
