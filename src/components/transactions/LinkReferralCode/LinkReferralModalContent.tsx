import React, { useState } from 'react';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import {
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Warning } from '../../primitives/Warning';
import { Box } from '@mui/system';
import { Trans } from '@lingui/macro';
import useLinkReferralCode from '../../../hooks/gravity/useLinkReferralCode';
import { ITxStatus } from '../../../utils/interface';

interface LinkReferralModalContentProps {
  inviteReferrerCode: string;
  setOpen: (value: boolean) => void;
}

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

export const LinkReferralModalContent = ({

  inviteReferrerCode,
  setOpen,
}: LinkReferralModalContentProps) => {
  const { readOnlyModeAddress, } = useWeb3Context();
  const [txStatus, setTxStatus] = useState<ITxStatus>('');
  const [msg, setMsg] = useState<string>('');
  const link = useLinkReferralCode(inviteReferrerCode);

  const handleLink = () => {
    link(
      () => setTxStatus('in-progress'),
      () => {
        setOpen(false);
        setTxStatus('successful');
      },
      (msg: string) => {
        setMsg(msg);
        setTxStatus('not-successful');
      }
    );
  };

  return (
    <>
      <TxModalTitle title="You have been Referred 🙌" />
      <Typography>
        Congrats! You have been referred by a friend using a referral link. You
        will now earn a 20% boost on your points.
      </Typography>

      <Warning severity="info" sx={{ mb: 2, mt: 2 }}>
        <Typography variant="caption">
          We will request you to sign a text message with your wallet to link to this referral code. This will not give ZeroLend
          any access to any assets on your wallet.
        </Typography>
      </Warning>

      <Warning severity="warning" sx={{ mb: 2, mt: 2 }}>
        <Typography variant="caption">
          Please be wary of scams and please ensure that you are signing transactions
          on the app.zerolend.xyz domain, only.
        </Typography>
      </Warning>


      <Box mt={6}>
        {msg.length > 0 && (
          <Warning severity="error" sx={{ mb: 2 }}>
            <Typography variant="caption">{msg}</Typography>
          </Warning>
        )}
        {txStatus === 'not-successful' && (
          <Warning severity="error" sx={{ mb: 2 }}>
            <Typography variant="caption">Something Went Wrong</Typography>
          </Warning>
        )}
        {readOnlyModeAddress && (
          <Typography
            variant="helperText"
            color="warning.main"
            sx={{ textAlign: 'center', mb: 2 }}
          >
            <Trans>Read-only mode. Connect to a wallet to link referral code.</Trans>
          </Typography>
        )}
        <Button
          variant="contained"
          fullWidth
          disabled={
            !!readOnlyModeAddress || inviteReferrerCode.length === 0 || txStatus === 'in-progress'
          }
          onClick={() => handleLink()}
        >
          {txStatus === 'in-progress' && (
            <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
          )}
          Verify Wallet
        </Button>
      </Box>
    </>
  );
};
