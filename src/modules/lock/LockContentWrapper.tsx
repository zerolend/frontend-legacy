import { Box, Grid, Typography } from '@mui/material';
import LockList from './LockList';
import StyledToggleButtonGroup from '../../components/StyledToggleButtonGroup';
import StyledToggleButton from '../../components/StyledToggleButton';
import { Trans } from '@lingui/macro';
import { useEffect, useState } from 'react';
import StakeLpBanner from './StakeLpBanner';
import StakeZEROBanner from './StakeZEROBanner';
import LockLPList from './LockLPList';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { CustomMarket } from 'src/ui-config/marketsConfig';

export const LockContentWrapper = () => {
  const [mode, setMode] = useState<'lockOverview' | 'lpOverview' | ''>('lockOverview');
  const { setCurrentMarket } = useProtocolDataContext();

  useEffect(() => {
    setCurrentMarket(CustomMarket.proto_linea_v3);
  }, []);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <StakeLpBanner />
        </Grid>
        <Grid item md={6}>
          <StakeZEROBanner />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: { xs: 'flex', lg: 'none' },
          flexDirection: 'column',
          justifyContent: { xs: 'center', xsm: 'flex-start' },
          mb: { xs: 2, xsm: 2 },
        }}
      >
        <StyledToggleButtonGroup
          color="primary"
          value={mode}
          exclusive
          onChange={(_, value) => setMode(value)}
          sx={{ width: { xs: '100%', xsm: '359px' }, height: '44px', mb: 2 }}
        >
          <StyledToggleButton value="lockOverview" disabled={mode === 'lockOverview'}>
            <Typography variant="subheader1">
              <Trans>Your Token Locks</Trans>
            </Typography>
          </StyledToggleButton>
          <StyledToggleButton value="lpOverview" disabled={mode === 'lpOverview'}>
            <Typography variant="subheader1">
              <Trans>Your LP Locks</Trans>
            </Typography>
          </StyledToggleButton>
        </StyledToggleButtonGroup>

        <Box>
          {mode === 'lpOverview' ? <LockLPList /> : <LockList />}
        </Box>
      </Box>
      <Box sx={{
        display: { xs: 'none', lg: 'flex' },
      }}>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6}>
            <LockLPList />
          </Grid>
          <Grid item sm={12} md={6}>
            <LockList />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
