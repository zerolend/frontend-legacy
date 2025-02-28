import { Trans } from '@lingui/macro';
import { Box, Link } from '@mui/material';
import * as React from 'react';

// import Marquee from 'react-fast-marquee';
// const AppMiniBanner = () => {
//   return (
//     <Box
//       sx={{
//         bgcolor: '#111',
//         color: '#fff',
//         display: 'flex',
//         justifyContent: 'center',
//         p: '3px',
//       }}
//     >
//       <Marquee pauseOnHover={true}>
//         <Link
//           href="https://github.com/zerolend/audits"
//           color="inherit"
//           target="_blank"
//           mr={6}
//           fontSize={12}
//           sx={{ textDecoration: 'none' }}
//         >
//           / <Trans> VIEW OUR AUDITS </Trans>
//         </Link>
//         <Link
//           href="https://guild.xyz/zerolend"
//           color="inherit"
//           target="_blank"
//           mr={6}
//           fontSize={12}
//           sx={{ textDecoration: 'none' }}
//         >
//           / <Trans> JOIN OUR GUILD </Trans>
//         </Link>
//         <Link
//           href="https://app.zerolend.xyz/stake/?marketName=proto_linea_v3"
//           color="inherit"
//           target="_blank"
//           mr={6}
//           fontSize={12}
//           sx={{ textDecoration: 'none' }}
//         >
//           / <Trans> STAKING IS LIVE </Trans>
//         </Link>
//         <Link
//           href="https://github.com/zerolend/audits"
//           color="inherit"
//           target="_blank"
//           mr={6}
//           fontSize={12}
//           sx={{ textDecoration: 'none' }}
//         >
//           / <Trans> VIEW OUR AUDITS </Trans>
//         </Link>
//         <Link
//           href="https://guild.xyz/zerolend"
//           color="inherit"
//           target="_blank"
//           mr={6}
//           fontSize={12}
//           sx={{ textDecoration: 'none' }}
//         >
//           / <Trans> JOIN OUR GUILD </Trans>
//         </Link>
//         <Link
//           href="https://app.zerolend.xyz/stake/?marketName=proto_linea_v3"
//           color="inherit"
//           target="_blank"
//           mr={6}
//           fontSize={12}
//           sx={{ textDecoration: 'none' }}
//         >
//           / <Trans> STAKING IS LIVE </Trans>
//         </Link>
//         <Link
//           href="https://github.com/zerolend/audits"
//           color="inherit"
//           target="_blank"
//           mr={6}
//           fontSize={12}
//           sx={{ textDecoration: 'none' }}
//         >
//           / <Trans> VIEW OUR AUDITS </Trans>
//         </Link>
//         <Link
//           href="https://guild.xyz/zerolend"
//           color="inherit"
//           target="_blank"
//           mr={6}
//           fontSize={12}
//           sx={{ textDecoration: 'none' }}
//         >
//           / <Trans> JOIN OUR GUILD </Trans>
//         </Link>
//         <Link
//           href="https://app.zerolend.xyz/stake/?marketName=proto_linea_v3"
//           color="inherit"
//           target="_blank"
//           mr={6}
//           fontSize={12}
//           sx={{ textDecoration: 'none' }}
//         >
//           / <Trans> STAKING IS LIVE </Trans>
//         </Link>
//       </Marquee>
//     </Box>
//   );
// };

const AppMiniBannerV2 = () => {
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
      <Link
        href="https://one.zerolend.xyz/"
        color="inherit"
        target="_blank"
        mr={6}
        fontSize={12}
        sx={{ textDecoration: 'none' }}
      >
        <Trans> Checkout the new ZeroLend dApp (Currently in Beta 🛠️) </Trans>
      </Link>
    </Box>
  );
};

export default AppMiniBannerV2;
