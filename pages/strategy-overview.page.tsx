import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  ComputedReserveData,
  useAppDataContext,
} from 'src/hooks/app-data-provider/useAppDataProvider';
import { AssetCapsProvider } from 'src/hooks/useAssetCaps';
import { MainLayout } from 'src/layouts/MainLayout';
import { ReserveConfigurationWrapper } from 'src/modules/reserve-overview/ReserveConfigurationWrapper';
import { ReserveTopDetailsWrapper } from 'src/modules/reserve-overview/ReserveTopDetailsWrapper';
import { useRootStore } from 'src/store/root';

import { ContentContainer } from '../src/components/ContentContainer';
import { StrategyActions } from 'src/modules/strategy/StrategyActions';

export default function StrategyOverview() {
  const router = useRouter();
  const { reserves } = useAppDataContext();
  const underlyingAsset = router.query.underlyingAsset as string;

  const [mode] = useState<'overview' | 'actions' | ''>('overview');
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Strategy Overview',
    });
  }, [trackEvent]);

  const reserve = reserves.find(
    (reserve) => reserve.underlyingAsset === underlyingAsset
  ) as ComputedReserveData;

  const isOverview = mode === 'overview';

  return reserve ? (
    <AssetCapsProvider asset={reserve}>
      <ReserveTopDetailsWrapper underlyingAsset={underlyingAsset} reserve={reserve} />
      <ContentContainer>
        <Box sx={{ display: 'flex' }}>
          {/** Main status and configuration panel*/}
          <Box
            sx={{
              display: { xs: !isOverview ? 'none' : 'block', lg: 'block' },
              width: { xs: '100%', lg: 'calc(100% - 432px)' },
              mr: { xs: 0, lg: 4 },
            }}
          >
            <ReserveConfigurationWrapper reserve={reserve} />
          </Box>

          {/** Right panel with actions*/}
          <Box
            sx={{
              display: { xs: isOverview ? 'none' : 'block', lg: 'block' },
              width: { xs: '100%', lg: '416px' },
            }}
          >
            <StrategyActions reserve={reserve} />
          </Box>
        </Box>
      </ContentContainer>
    </AssetCapsProvider>
  ) : (
    <></>
  );
}

StrategyOverview.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
