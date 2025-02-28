import { Box, Typography } from '@mui/material';
import { Link } from './primitives/Link';

export const AuditBanner = () => {
  return (
    <Box
      sx={{
        bgcolor: '#111',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        p: '3px',
      }}
    >
      <Typography variant="caption">
        ZeroLend is audited by
        <Link
          href="https://github.com/zerolend/audits/"
          target="_blank"
          variant="description"
          color="#fff"
          sx={{ textDecoration: 'underline', ml: 1 }}
        >
          multiple auditors
        </Link>{' '}
        and is actively monitored by Chaos Labs, Apostros and Into the Block
      </Typography>
    </Box>
  );
};
