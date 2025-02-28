import { Trans } from '@lingui/macro';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { Link } from 'src/components/primitives/Link';

export const ClaimAirdrop = () => {
  const isCustomBreakpoint = useMediaQuery('(min-width:1125px)');

  return (
    <Box
      sx={{
        pt: 5,
        mb: 10,
        px: {
          md: 6,
        },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <Box
        component={Link}
        href={'https://airdrop.zerolend.xyz'}
        sx={(theme) => ({
          borderRadius: {
            md: 4,
          },
          display: 'flex',
          backgroundColor: theme.palette.mode === 'dark' ? '#39375A80' : '#C9B3F94D',
          position: 'relative',
          alignItems: {
            xs: 'none',
            xsm: 'center',
          },
          justifyContent: {
            xs: 'space-around',
            xsm: 'none',
          },
          flexDirection: {
            xs: 'column',
            xsm: 'row',
          },
          [theme.breakpoints.up(1125)]: {
            padding: {
              xs: '24px 24px 24px 240x',
              lg: '24px 32px 24px 240x',
            },
          },
          padding: {
            xs: '16px',
            // xsm: '16px 16px 16px 180px',
            // sm: '16px 24px 16px 188px',
            // md: '22px 20px 22px 200px',
          },
          gap: {
            xs: 6,
          },
        })}
      >
        {/* <Box
          component="img"
          src="/illustration_desktop.png"
          alt="ghost and coin"
          sx={{
            ['@media screen and (min-width: 1125px)']: {
              width: 290,
            },
            width: {
              xs: 198,
              xsm: 229,
              md: 266,
            },
            position: 'absolute',
            top: {
              xs: -40,
              xsm: -35,
              md: -63,
            },
            right: {
              xs: -50,
              xsm: 'unset',
            },
            left: {
              xsm: -10,
            },
          }}
        /> */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            mr: {
              lg: '5%',
            },
            alignItems: {
              xs: 'none',
              md: 'middle',
            },
            flexDirection: {
              xs: 'column',
              md: 'row',
            },
            gap: {
              xs: 3,
            },
            height: '100%',
          }}
        >
          <Box
            sx={{
              pr: {
                xs: '140px',
                xsm: 0,
              },
              cursor: 'pointer',
              zIndex: 100,
              minWidth: {
                md: 232,
              },
              // ['@media screen and (min-width: 1125px)']: {
              //   width: {
              //     xs: '278px',
              //     lg: '320px',
              //   },
              // },
            }}
          >
            <Typography
              sx={(theme) => ({
                [theme.breakpoints.up(1125)]: {
                  typography: 'h3',
                },
                typography: {
                  xs: 'subheader1',
                  md: 'h4',
                },
              })}
            >
              <Trans>$ZERO staking is live</Trans>
            </Typography>
            <Typography
              sx={(theme) => ({
                [theme.breakpoints.up(1125)]: {
                  typography: 'description',
                },
                typography: {
                  xs: 'caption',
                },
              })}
              color="text.secondary"
            >
              Stake $ZERO tokens to receive voting power, protocol incentives, and potential future
              airdrops from other protocols.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          component={Link}
          size={isCustomBreakpoint ? 'medium' : 'large'}
          href={'/stake'}
          sx={{
            marginLeft: {
              xs: 'none',
              xsm: 'auto',
            },
            whiteSpace: 'no-wrap',
            minWidth: 'max-content',
          }}
        >
          <Trans>Stake ZERO</Trans>
        </Button>
      </Box>
    </Box>
  );
};
