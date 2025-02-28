import { useEffect } from 'react';
import { useRootStore } from 'src/store/root';

import { ContentContainer } from '../src/components/ContentContainer';
import { MainLayout } from '../src/layouts/MainLayout';
import { RewardsTopPanel } from '../src/modules/rewards/RewardsTopPanel';
import * as React from 'react';
import IsolatedMarketSwitcher from 'src/components/IsolatedMarketSwitcher';
import { RewardsContentWrapper } from 'src/modules/rewards/RewardsContentWrapper';
import { ConnectWalletPaper } from 'src/components/ConnectWalletPaper';
import { usePermissions } from 'src/hooks/usePermissions';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

export default function RewardsPage() {
  const { currentAccount, loading: web3Loading } = useWeb3Context();
  const { isPermissionsLoading } = usePermissions();
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Rewards',
    });
  }, [trackEvent]);

  return (
    <>
      <RewardsTopPanel />
      <ContentContainer>

        <IsolatedMarketSwitcher />
        {currentAccount && !isPermissionsLoading ? (
          <RewardsContentWrapper />
        ) : (
          <ConnectWalletPaper loading={web3Loading} />
        )}
      </ContentContainer>
    </>
  );
}

RewardsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
