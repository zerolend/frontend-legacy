import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';
import { Warning } from 'src/components/primitives/Warning';

interface BridgeErrorsProps {
  balance: string;
  inputAmount: string;
}

export const BridgeErrors = ({ balance, inputAmount }: BridgeErrorsProps) => {
  if (Number(inputAmount) > Number(balance)) {
    return (
      <Warning severity="error" sx={{ mt: 4 }} icon={false}>
        <Typography variant="caption">
          <Trans>Your balance is lower than the selected amount.</Trans>
        </Typography>
      </Warning>
    );
  }
  return null;
};
