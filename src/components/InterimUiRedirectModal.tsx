import { Trans } from '@lingui/macro';
import { Button, Typography } from '@mui/material';
import { BasicModal } from './primitives/BasicModal';
import { Link } from './primitives/Link';

interface InterimUIRedirectModalProps {
  marketId: string;
  open?: boolean;
}

export const InterimUIRedirectModal = ({ open, marketId }: InterimUIRedirectModalProps) => {
  const linkOld = 'http://legacy.zerolend.xyz/?marketName=' + marketId;
  const linkNew = 'http://one.zerolend.xyz/market/?marketName=' + marketId;

  return (
    <BasicModal open={open || false} contentMaxWidth={500} setOpen={() => { /* nothing */ }}>
      <Typography variant="h2" mb={3}>
        <Trans>This market has been moved to the new UI</Trans>
      </Typography>
      <Typography mb={6}>
        <Trans>
          This market is now accessible via the new ZeroLend UI. The new UI offers a more
          user-friendly experience and provides additional features that are not available on this version.
        </Trans>
      </Typography>
      <Typography mb={6}>
        <Trans>
          If you choose not to use the new UI, you can continue to use the legacy UI over at <Link color={'blue'} href={linkOld}>legacy.zerolend.xyz</Link>.
        </Trans>
      </Typography>
      <Button variant="contained" fullWidth href={linkNew}>
        {/* <SvgIcon fontSize="small" sx={{ mx: 1 }}>
            <LogoutIcon />
          </SvgIcon> */}
        <Trans>Take me to the new UI 🚀</Trans>
      </Button>
    </BasicModal>
  );
};
