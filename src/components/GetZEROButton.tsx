import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Button, SvgIcon, Typography } from '@mui/material';
import { Link } from './primitives/Link';
import zero from './icons/zero.svg';

export const GetZEROButton = () => {
  return (
    <Button
      startIcon={<img src={zero} alt={'zero'} style={{ width: 14, height: 14 }} />}
      endIcon={
        <SvgIcon sx={{ width: 14, height: 14 }}>
          <ExternalLinkIcon />
        </SvgIcon>
      }
      component={Link}
      size="small"
      variant="outlined"
      href={'https://app.lynex.fi/swap'}
    >
      <Typography variant="buttonS">{'getZERO'}</Typography>
    </Button>
  );
};
