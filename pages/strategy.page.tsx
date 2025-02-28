import { useEffect } from 'react';
import { usePermissions } from 'src/hooks/usePermissions';
import { useRootStore } from 'src/store/root';

import { ConnectWalletPaper } from '../src/components/ConnectWalletPaper';
import { ContentContainer } from '../src/components/ContentContainer';
import { MainLayout } from '../src/layouts/MainLayout';
import { useWeb3Context } from '../src/libs/hooks/useWeb3Context';
import { StrategyTopPanel } from 'src/modules/strategy/StrategyTopPanel';
import { StrategyContentWrapper } from 'src/modules/strategy/StrategyContentWrapper';

export default function StrategyPage() {
  const { currentAccount, loading: web3Loading } = useWeb3Context();
  const { isPermissionsLoading } = usePermissions();
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Strategy',
    });
  }, [trackEvent]);

  return (
    <>
      <StrategyTopPanel />

      <ContentContainer>
        {currentAccount && !isPermissionsLoading ? (
          <StrategyContentWrapper />
        ) : (
          <ConnectWalletPaper loading={web3Loading} />
        )}
      </ContentContainer>
    </>
  );
}

StrategyPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
