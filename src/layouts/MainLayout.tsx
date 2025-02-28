import { Box } from '@mui/material';
import React, { ReactNode, useEffect } from 'react';

import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import AppMiniBanner from './AppMiniBanner';
import useGetGravityPublicUserData from '../hooks/gravity/useGetGravityPublicUserData';
import { useRootStore } from '../store/root';
import { useModalContext } from '../hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

export function MainLayout({ children }: { children: ReactNode }) {
  const { openLinkReferralModal } = useModalContext();

  // check referral link in the
  const userData = useGetGravityPublicUserData();
  const inviteReferrerCode = useRootStore.getState().invite;
  const { currentAccount: walletAddress } = useWeb3Context();

  useEffect(() => {
    if (walletAddress && userData.value?.referrerCode === undefined && !userData.isLoading && inviteReferrerCode !== '') {
      openLinkReferralModal(inviteReferrerCode || '');
    }
  }, [userData.value?.referrerCode, walletAddress, inviteReferrerCode, userData.isLoading]);


  return (
    <>
      <AppMiniBanner />
      <AppHeader />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {children}
      </Box>
      <AppFooter />
    </>
  );
}
