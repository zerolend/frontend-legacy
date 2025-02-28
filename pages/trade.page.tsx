import { useEffect } from 'react';
import { usePermissions } from 'src/hooks/usePermissions';
import { useRootStore } from 'src/store/root';

import { ConnectWalletPaper } from '../src/components/ConnectWalletPaper';
import { ContentContainer } from '../src/components/ContentContainer';
import { MainLayout } from '../src/layouts/MainLayout';
import { useWeb3Context } from '../src/libs/hooks/useWeb3Context';
import { TradeContentWrapper } from '../src/modules/trade/TradeContentWrapper';
import { TradeTopPanel } from '../src/modules/trade/TradeTopPanel';

export default function TradePage() {
  const { currentAccount, loading: web3Loading } = useWeb3Context();
  const { isPermissionsLoading } = usePermissions();
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Trade',
    });
  }, [trackEvent]);

  return (
    <>
      <TradeTopPanel />

      <ContentContainer>
        {currentAccount && !isPermissionsLoading ? (
          <TradeContentWrapper />
        ) : (
          <ConnectWalletPaper loading={web3Loading} />
        )}
      </ContentContainer>
    </>
  );
}

TradePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
