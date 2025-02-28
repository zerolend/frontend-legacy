import { Trans } from '@lingui/macro';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { Link } from 'src/components/primitives/Link';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useRootStore } from 'src/store/root';

export type MarketBannerProps = {
  title?: string;
  description?: React.ReactNode;
  img?: string;
  link?: string;
  cta?: {
    text: string;
    link: string;
  };
};

export const MarketBanner = (props: MarketBannerProps) => {
  const isCustomBreakpoint = useMediaQuery('(min-width:1125px)');
  const merkleAPR = useRootStore((state) => state.merkleAPR);
  const { currentMarket } = useProtocolDataContext();

  return (
    <Box
      sx={{
        pt: 2,
        mb: 10,
        px: {
          md: 6,
        },
        zIndex: 0,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <Box
        component={Link}
        href={props?.cta?.link || ''}
        sx={(theme) => ({
          borderRadius: {
            md: 2,
          },
          overflow: 'hidden',
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            mr: {
              lg: '150px',
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
            {props?.title && (
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
                <Trans>
                  {props.title?.replace(
                    'X%',
                    `${merkleAPR
                      .filter(
                        (data) => data.chainId === 1 && currentMarket === 'proto_mainnet_rwa_v3'
                      )
                      .map((data) => {
                        return Math.ceil(data.apr);
                      })}%`
                  )}
                </Trans>
              </Typography>
            )}
            {props?.description && (
              <Box
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
                {props.description}
              </Box>
            )}
          </Box>
        </Box>
        {props?.cta && (
          <Button
            variant="contained"
            component={Link}
            target="_blank"
            size={isCustomBreakpoint ? 'medium' : 'large'}
            href={props.cta.link}
            sx={{
              marginLeft: {
                xs: 'none',
                xsm: 'auto',
              },
              whiteSpace: 'no-wrap',
              minWidth: 'max-content',
            }}
          >
            <Trans>{props.cta.text}</Trans>
          </Button>
        )}
        {props.img && (
          <img
            src={props.img}
            style={{
              position: 'absolute',
              width: '150px',
              opacity: 0.2,
              zIndex: -1,
              right: 0,
              bottom: 0,
            }}
            alt="banner"
          />
        )}
      </Box>
    </Box>
  );
};
