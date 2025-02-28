import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';
import { Warning } from '../primitives/Warning';

export const GaslessWarning = () => {
  return (
    <Warning severity="warning" sx={{ '.MuiAlert-message': { p: 0 }, mt: 3 }}>
      <Typography variant="caption">
        <Trans>This transaction fee is too high. Please procced if you wish to.</Trans>
      </Typography>
    </Warning>
  );
};
