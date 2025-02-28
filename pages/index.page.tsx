import { Container } from '@mui/material';
import { ReactNode, useEffect } from 'react';
import { MainLayout } from 'src/layouts/MainLayout';
import { MarketAssetsListContainer } from 'src/modules/markets/MarketAssetsListContainer';
import { MarketsTopPanel } from 'src/modules/markets/MarketsTopPanel';
import { useRootStore } from 'src/store/root';
import { ContentContainer } from '../src/components/ContentContainer';
import IsolatedMarketSwitcher from '../src/components/IsolatedMarketSwitcher';

interface MarketContainerProps {
  children: ReactNode;
}

export const marketContainerProps = {
  sx: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    pb: '39px',
    px: {
      xs: 2,
      xsm: 5,
      sm: 12,
      md: 5,
      lg: 0,
      xl: '96px',
      xxl: 0,
    },
    maxWidth: {
      xs: 'unset',
      lg: '1240px',
      xl: '1240px',
      xxl: '1240px',
    },
  },
};

export const MarketContainer = ({ children }: MarketContainerProps) => {
  return <Container {...marketContainerProps}>{children}</Container>;
};

export default function Markets() {
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Markets',
    });
  }, [trackEvent]);

  return (
    <>
      <MarketsTopPanel />
      <ContentContainer>
        <MarketContainer>
          <IsolatedMarketSwitcher />
          <MarketAssetsListContainer />
        </MarketContainer>
      </ContentContainer>
    </>
  );
}

Markets.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
