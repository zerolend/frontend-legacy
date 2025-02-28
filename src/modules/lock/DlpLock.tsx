import Box from '@mui/material/Box';
import React, { useMemo, useState } from 'react';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { AssetInput } from '../../components/transactions/AssetInput';
import { Trans } from '@lingui/macro';
import { Button, Grid, Typography } from '@mui/material';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';

type IDurations = '3 months' | '6 months' | '1 year' | '2 year' | '4 year';

const Durations: IDurations[] = ['3 months', '6 months', '1 year', '2 year', '4 year'];

const DlpLock = () => {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState<IDurations>('4 year');

  const apr = useMemo(() => {
    return 2;
  }, [duration]);

  return (
    <ListWrapper
      titleComponent={
        <Typography component="div" variant="h3" sx={{ mr: 4 }}>
          <Trans>DLP Locker</Trans>
        </Typography>
      }
    >
      <Box px={6} pb={6}>
        <Box mb={4}>
          <AssetInput
            value={amount}
            onChange={setAmount}
            usdValue={'0.00'}
            symbol={'dlpToken'}
            assets={[
              {
                balance: '0.00',
                symbol: 'dlpToken',
                iconSymbol: 'dlpToken',
              },
            ]}
            isMaxSelected={false}
            disabled={false}
            maxValue={'0.000'}
            balanceText={<Trans>Wallet balance</Trans>}
          />
        </Box>
        <Box>
          <Typography component={'div'} variant={'h4'} mb={2}>
            Lock Length
          </Typography>
          <Box display={'flex'}>
            {Durations.map((_d, index) => {
              return (
                <Box flex={1 / Durations.length} px={1} key={index}>
                  <Button
                    variant={duration === _d ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => setDuration(_d)}
                  >
                    {_d}
                  </Button>
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box height={'1px'} my={6} bgcolor={'lightGray'}></Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography component={'div'} variant={'h4'}>
            APR
          </Typography>
          <FormattedNumber value={apr} symbol={'%'} />
        </Box>
        <Grid container mt={8} spacing={2}>
          <Grid item lg={6}>
            <Button variant="outlined" fullWidth>
              Reset
            </Button>
          </Grid>
          <Grid item lg={6}>
            <Button variant="contained" fullWidth>
              Stake
            </Button>
          </Grid>
        </Grid>
      </Box>
    </ListWrapper>
  );
};

export default DlpLock;
