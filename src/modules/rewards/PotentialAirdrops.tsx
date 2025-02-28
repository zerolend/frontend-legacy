import { ListWrapper } from 'src/components/lists/ListWrapper';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import * as React from 'react';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { NoData } from '../../components/primitives/NoData';

const PotentialAirdrops = () => {
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const downToMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box position={'relative'} overflow={'hidden'} mt={downToMD ? 6 : 0}>
      <ListWrapper
        titleComponent={
          <Box>
            <Typography component="p" variant="h3" sx={{ mr: 4 }}>
              <Trans>Protocol Eligible Incentives</Trans>
            </Typography>
            <Typography component="p" variant="description" sx={{ mr: 4 }} color={'text.muted'}>
              <Trans>
                By staking ZERO, you are entitled to upto 80% of any future potential airdrops that
                the ZeroLend protocol receives.
              </Trans>
            </Typography>
          </Box>
        }
        localStorageName={'claimPendingRewards'}
      >
        <Box sx={downToSM ? { px: 4, pb: 6 } : { px: 6, pb: 6 }}>
          <Typography
            component="div"
            variant="description"
            sx={{ color: 'text.muted' }}
            textAlign={'center'}
          ></Typography>
          <Box>
            <Box display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'} mb={2}>
              <Box>
                <Typography variant={'h4'}>PYTH Airdrop for ZERO Stakers</Typography>
                <Typography variant={'caption'} color={'text.muted'}>
                  PYTH delivers real-time market data for crypto, equities, FX, and commodities to
                  50+ blockchains. 95+ major market participants.
                </Typography>
              </Box>
              <Box textAlign={'right'} ml={4}>
                <Box display={'flex'} alignItems={'baseline'} justifyContent={'flex-end'}>
                  <Typography variant={'caption'} mr={1}>
                    upto
                  </Typography>
                  <FormattedNumber
                    value={'400000'}
                    variant={'h3'}
                    visibleDecimals={2}
                    symbol={'PYTH'}
                    compact={true}
                    symbolsColor="#A5A8B6"
                    symbolsVariant={'h4'}
                    data-cy={'Claim_Value'}
                    sx={{ display: 'flex', alignItems: 'baseline' }}
                  />
                </Box>
                <Button
                  variant="contained"
                  size={'small'}
                  href={'https://www.intract.io/quest/6704c87ec8593344621ce29d'}
                  target={'_blank'}
                  disabled={true}
                >
                  Done
                </Button>
              </Box>
            </Box>
            <Box display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'} mb={2}>
              <Box>
                <Typography variant={'h4'}>LXP-L Referral Points for ZERO Stakers</Typography>
                <Typography variant={'caption'} color={'text.muted'}>
                  LXP-L is a points program used to incentvize liquidity amongst the linea
                  ecosystem. 40% of any airdrop from the points that ZeroLend receives will be
                  distributed to stakers.
                </Typography>
              </Box>
              <Box textAlign={'right'} ml={4}>
                <NoData />
                <Button variant="contained" size={'small'} disabled>
                  Upcoming
                </Button>
              </Box>
            </Box>
            <Box display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
              <Box>
                <Typography variant={'h4'}>Blast Gold for ZERO Stakers</Typography>
                <Typography variant={'caption'} color={'text.muted'}>
                  The Blast airdrop is split between Blast Points and Blast Gold. Blast Gold is
                  distributed manually to Dapps by the core contributors. Any Blast Gold that ZL
                  receives from partners projects will get distributed to stakers.
                </Typography>
              </Box>
              <Box textAlign={'right'} ml={4}>
                <NoData />
                <Button variant="contained" size={'small'} disabled>
                  Upcoming
                </Button>
              </Box>
            </Box>
          </Box>
          {/* <Box> */}
          {/* <Button sx={{ mb: 2, mr: 2 }} variant="contained" disabled>
              Claim zkSync Airdrop
            </Button> */}
          {/* <Button sx={{ mb: 2, mr: 2 }} variant="contained" disabled>
              Claim Linea Airdrop
            </Button>
            <Button sx={{ mb: 2, mr: 2 }} variant="contained" disabled>
              Claim Blast Airdrop
            </Button> */}
          {/* <Button sx={{ mb: 2, mr: 2 }} variant="contained" disabled>
              Claim Pyth Airdrop
            </Button> */}
          {/* </Box> */}
        </Box>
      </ListWrapper>
    </Box>
  );
};

export default PotentialAirdrops;
