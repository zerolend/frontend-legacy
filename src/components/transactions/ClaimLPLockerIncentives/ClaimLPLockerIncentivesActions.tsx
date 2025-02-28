import { Trans } from '@lingui/macro';
import { Box, BoxProps, Button, CircularProgress, Typography } from '@mui/material';
import { TxStateType } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

export interface ClaimLPLockerIncentivesActionProps extends BoxProps {
  mainTxState: TxStateType;
  approvalTxState: TxStateType;
  handleLockAction: () => void;
  isApproved: boolean;
  isClaimable: boolean;
}

export const ClaimLPLockerIncentivesAction = ({
  isApproved,
  handleLockAction,
  mainTxState,
  approvalTxState,
  isClaimable,
}: ClaimLPLockerIncentivesActionProps) => {
  const { readOnlyModeAddress } = useWeb3Context();

  function getMainParams() {
    if (!isClaimable) return { disabled: true, content: 'Not enough to Claim' };
    if (mainTxState?.loading)
      return { loading: true, disabled: true, content: `Claiming Incentives` };
    if (approvalTxState?.loading)
      return { loading: true, disabled: true, content: 'Approving ZERO' };
    if (!isApproved && !approvalTxState?.success)
      return { disabled: false, content: 'Approve ZERO' };
    if (isApproved) return { loading: false, disabled: false, content: `Claim Staking Rewards` };
    return { content: 'Claim Staking Rewards', handleClick: handleLockAction };
  }

  const { loading, disabled, content } = getMainParams();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 6 }}>
      <Button
        variant="contained"
        disabled={readOnlyModeAddress !== undefined || disabled || loading}
        onClick={handleLockAction}
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
