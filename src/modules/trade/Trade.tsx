import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import StyledToggleButtonGroup from '../../components/StyledToggleButtonGroup';
import StyledToggleButton from '../../components/StyledToggleButton';
import { Trans } from '@lingui/macro';
import React, { useState } from 'react';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import Buy from './Buy';

const Trade = () => {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');

  return (
    <ListWrapper titleComponent={''}>
      <Box px={6} pb={6}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', xsm: 'flex-start' },
            mb: { xs: 3, xsm: 4 },
          }}
        >
          <StyledToggleButtonGroup
            color="primary"
            value={mode}
            exclusive
            onChange={(_, value) => setMode(value)}
            sx={{ width: '100%', height: '44px' }}
          >
            <StyledToggleButton value="buy" disabled={mode === 'buy'}>
              <Typography variant="subheader1">
                <Trans>Buy</Trans>
              </Typography>
            </StyledToggleButton>
            <StyledToggleButton value="sell" disabled={mode === 'sell'}>
              <Typography variant="subheader1">
                <Trans>Sell</Trans>
              </Typography>
            </StyledToggleButton>
          </StyledToggleButtonGroup>
        </Box>
        <Box>{mode === 'buy' && <Buy />}</Box>
      </Box>
    </ListWrapper>
  );
};

export default Trade;
