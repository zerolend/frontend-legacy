import { Trans } from '@lingui/macro';
import { Box, FormControlLabel, ListItem, ListItemText, MenuItem, Switch } from '@mui/material';
import React from 'react';
import { useRootStore } from 'src/store/root';
import { SETTINGS } from 'src/utils/mixPanelEvents';

interface GaslessModeSwitcherProps {
  component?: typeof MenuItem | typeof ListItem;
}

export const GaslessModeSwitcher = ({ component = ListItem }: GaslessModeSwitcherProps) => {
  const [gaslessEnabled, setGaslessEnabled] = useRootStore((state) => [
    state.gaslessEnabled,
    state.setGaslessEnabled,
  ]);

  const trackEvent = useRootStore((store) => store.trackEvent);

  const togglegaslessEnabled = () => {
    setGaslessEnabled(!gaslessEnabled);
  };

  return (
    <Box
      component={component}
      onClick={togglegaslessEnabled}
      sx={{
        cursor: 'pointer',
        color: { xs: '#F1F1F3', md: 'text.primary' },
        py: { xs: 1.5, md: 2 },
        px: 0,
      }}
    >
      <ListItemText>
        <Trans>Gasless Transaction</Trans>
      </ListItemText>
      <FormControlLabel
        sx={{ mr: 0 }}
        value="gaslessMode"
        control={
          <Switch
            disableRipple
            onClick={() => trackEvent(SETTINGS.TESTNET_MODE)}
            checked={gaslessEnabled}
            sx={{ '.MuiSwitch-track': { bgcolor: { xs: '#FFFFFF1F', md: 'primary.light' } } }}
          />
        }
        label={gaslessEnabled ? 'On' : 'Off'}
        labelPlacement="start"
      />
    </Box>
  );
};
