import {
  Box,
  Container,
  ContainerProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ReactNode, useEffect } from 'react';

import { PageTitle, PageTitleProps } from './PageTitle';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';

interface TopInfoPanelProps extends PageTitleProps {
  children?: ReactNode;
  titleComponent?: ReactNode;
  containerProps?: ContainerProps;
  pageDesc?: ReactNode;
  pageKey?: string;
}

export const TopInfoPanel = ({
  pageTitle,
  pageDesc,
  titleComponent,
  withMarketSwitcher,
  withMigrateButton,
  bridge,
  children,
  containerProps = {},
}: // pageKey,
  TopInfoPanelProps) => {
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));

  const { currentMarketData } = useProtocolDataContext();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const gradient = new window.Gradient();
    gradient.initGradient('#gradient-canvas');
  }, []);

  return (
    <Box
      id={'top-info-panel'}
      sx={{
        color: '#F1F1F3',
      }}
    >
      {/*<TopBarAnimation/>*/}
      <canvas id="gradient-canvas"></canvas>
      <Box id="top-bg" style={currentMarketData?.bg ? { display: 'block' } : { display: 'none' }}>
        <img src={'/bear.jpg'} alt={'bearchain'} />
      </Box>
      <Box
        sx={{
          pt: { xs: 6, md: 8 },
          pb: { xs: 18, md: 20, lg: '94px', xl: '80px', xxl: '80px' },
          color: '#F1F1F3',
        }}
      >
        <Container {...containerProps} sx={{ ...containerProps.sx, pb: 0 }}>
          <Box sx={{ px: { xs: 4, xsm: 6 } }}>
            {!titleComponent && (
              <PageTitle
                pageTitle={pageTitle}
                withMarketSwitcher={withMarketSwitcher}
                withMigrateButton={withMigrateButton}
                bridge={bridge}
              />
            )}

            {titleComponent && titleComponent}

            {pageDesc && (
              <Typography
                variant={'main14'}
                sx={{
                  color: 'text.muted',
                  mt: 2,
                  mr: { xs: 5, xsm: 3 },
                  maxWidth: 750,
                  mb: pageDesc ? 4 : 0,
                }}
                style={downToXSM ? { marginTop: '0px' } : { marginTop: '-12px' }}
              >
                {pageDesc}
              </Typography>
            )}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: { xs: 3, xsm: 8 },
                flexWrap: 'wrap',
                width: '100%',
              }}
            >
              {children}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
