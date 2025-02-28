import * as React from 'react';
import { useEffect } from 'react';
import { useRootStore } from 'src/store/root';

import { ContentContainer } from '../src/components/ContentContainer';
import { MainLayout } from '../src/layouts/MainLayout';
import { LockTopPanel } from '../src/modules/lock/LockTopPanel';
import { LockContentWrapper } from 'src/modules/lock/LockContentWrapper';
import { ConnectWalletPaper } from 'src/components/ConnectWalletPaper';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { usePermissions } from 'src/hooks/usePermissions';

export default function TradePage() {
  const { currentAccount, loading: web3Loading } = useWeb3Context();
  const { isPermissionsLoading } = usePermissions();
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Lock',
    });
  }, [trackEvent]);

  return (
    <>
      <LockTopPanel />

      <ContentContainer>
        {currentAccount && !isPermissionsLoading ? (
          <LockContentWrapper />
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
