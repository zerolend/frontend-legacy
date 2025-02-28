import { Trans } from '@lingui/macro';
import { Box, BoxProps, Button, CircularProgress, Typography } from '@mui/material';
import { TxStateType } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

export interface VestEZeroActionProps extends BoxProps {
  isWrongNetwork: boolean;
  mainTxState: TxStateType;
  approvalTxState: TxStateType;
  handleVestAction: () => void;
  isApproved: boolean;
  isClaimed: boolean;
  text: string;
}

export const ConvertEarlyZeroActions = ({
  isWrongNetwork,
  isApproved,
  handleVestAction,
  mainTxState,
  approvalTxState,
  isClaimed,
  text,
}: VestEZeroActionProps) => {
  const { readOnlyModeAddress } = useWeb3Context();

  function getMainParams() {
    if (mainTxState?.loading) return { loading: true, disabled: true, content: text };
    if (isClaimed) return { disabled: true, content: 'Already claimed' };
    if (isWrongNetwork) return { disabled: true };
    if (isApproved) return { loading: false, disabled: false, content: text };
    if (!isApproved && !approvalTxState?.success)
      return { disabled: false, content: 'Approve EZERO' };
    return { disabled: false, content: text, handleClick: handleVestAction };
  }

  const { loading, disabled, content } = getMainParams();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 6 }}>
      <Button
        variant="contained"
        disabled={readOnlyModeAddress !== undefined || disabled || loading}
        onClick={handleVestAction}
        size="large"
        sx={{ minHeight: '44px' }}
        data-cy="actionButton"
      >
        {loading && <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />}
        {content}
      </Button>

      {readOnlyModeAddress && (
        <Typography variant="helperText" color="warning.main" sx={{ textAlign: 'center', mt: 2 }}>
          <Trans>Read-only mode. Connect to a wallet to perform transactions.</Trans>
        </Typography>
      )}
    </Box>
  );
};
