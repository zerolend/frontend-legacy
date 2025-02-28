import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';

export const WithdrawVestZeroModalContent = React.memo(() => {
  return (
    <Box pb={2}>
      <TxModalTitle title={'Withdraw Vest ZERO'} />
      <Box>
        <Typography
          component="div"
          variant="description"
          sx={{ mb: 4, color: 'text.muted' }}
          textAlign={'center'}
        >
          When the ZERO governance token goes live you will be able to convert your earlyZERO tokens
          into ZERO at a 1:1 ratio with vesting, or stake it into a veNFT with no vesting.
        </Typography>
        <Typography
          component="div"
          variant="description"
          sx={{ color: 'text.muted' }}
          textAlign={'center'}
        >
          Holding earlyZERO also entitles you to 40% of the potential zkSync token airdrop that the
          ZeroLend protocol will receive.
        </Typography>
      </Box>
      <Box mt={8}>
        <Button variant="contained" fullWidth>
          Withdraw
        </Button>
      </Box>
    </Box>
  );
});

export default WithdrawVestZeroModalContent;
