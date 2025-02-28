import { Box, Button, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import { AssetInput } from '../../components/transactions/AssetInput';
import React, { useState } from 'react';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import Countdown from 'react-countdown';

const Buy = () => {
  const [amount, setAmount] = useState('');
  const [zamount, setZAmount] = useState('');

  return (
    <Box>
      {/*<Typography component="div" variant="h3" mb={8} textAlign={'center'}>
        <Trans>Buy</Trans>
      </Typography>*/}
      <Box mb={4}>
        <AssetInput
          value={amount}
          onChange={setAmount}
          usdValue={'0.00'}
          symbol={'ETH'}
          assets={[
            {
              balance: '0.00',
              symbol: 'ETH',
              iconSymbol: 'ETH',
            },
          ]}
          isMaxSelected={false}
          disabled={false}
          maxValue={'0.000'}
          balanceText={<Trans>Wallet balance</Trans>}
        />
      </Box>

      <AssetInput
        inputTitle={'You Receive'}
        value={zamount}
        onChange={setZAmount}
        usdValue={'0.00'}
        symbol={'ZERO'}
        assets={[
          {
            balance: '0.00',
            symbol: 'ETH',
            iconSymbol: 'ETH',
          },
        ]}
        isMaxSelected={false}
        disabled={false}
        maxValue={'0.000'}
        balanceText={<Trans>Wallet balance</Trans>}
      />
      <Box height={'1px'} my={6} bgcolor={'lightGray'}></Box>
      <Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
          <Box>
            <Typography>Price</Typography>
          </Box>
          <Box>
            <FormattedNumber value={'0.00'} />
          </Box>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
          <Box>
            <Typography>Receive amount</Typography>
          </Box>
          <Box>
            <FormattedNumber value={'0.00'} symbol={'ZERO'} />
          </Box>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
          <Box>
            <Typography>Slippage</Typography>
          </Box>
          <Box>
            <FormattedNumber value={'0.00'} />
          </Box>
        </Box>
      </Box>
      <Box mt={8}>
        <Box mb={4}>
          <Countdown
            date={new Date('December 17, 2023 03:30:00 UTC').getTime()}
            intervalDelay={0}
            precision={3}
            renderer={({ days, minutes, seconds }) => {
              return (
                <Typography fontSize={18} textAlign={'center'}>
                  Sale Starts in {days} days: {minutes} mins: {seconds} sec
                </Typography>
              );
            }}
          />
        </Box>
        <Button variant="contained" fullWidth>
          Buy
        </Button>
      </Box>
    </Box>
  );
};

export default Buy;
