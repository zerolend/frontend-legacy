import '/public/fonts/inter/inter.css';
import '/src/styles/variables.css';
import '/scripts/strip-gradient.js';

import { CacheProvider, EmotionCache } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Web3ReactProvider } from '@web3-react/core';
import * as Sentry from '@sentry/react';
import { providers } from 'ethers';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactNode, useEffect } from 'react';
import { AddressBlocked } from 'src/components/AddressBlocked';
import { Meta } from 'src/components/Meta';
import { TransactionEventHandler } from 'src/components/TransactionEventHandler';
import { SwitchModal } from 'src/components/transactions/Switch/SwitchModal';
import { BorrowModal } from 'src/components/transactions/Borrow/BorrowModal';
import { StakeZeroModal } from 'src/components/transactions/StakeZero/StakeZeroModal';
import { ClaimRewardsModal } from 'src/components/transactions/ClaimRewards/ClaimRewardsModal';
import { CollateralChangeModal } from 'src/components/transactions/CollateralChange/CollateralChangeModal';
import { DebtSwitchModal } from 'src/components/transactions/DebtSwitch/DebtSwitchModal';
import { EmodeModal } from 'src/components/transactions/Emode/EmodeModal';
import { FaucetModal } from 'src/components/transactions/Faucet/FaucetModal';
import { GasStationProvider } from 'src/components/transactions/GasStation/GasStationProvider';
import { MigrateV3Modal } from 'src/components/transactions/MigrateV3/MigrateV3Modal';
import { RateSwitchModal } from 'src/components/transactions/RateSwitch/RateSwitchModal';
import { RepayModal } from 'src/components/transactions/Repay/RepayModal';
import { SupplyModal } from 'src/components/transactions/Supply/SupplyModal';
import { SwapModal } from 'src/components/transactions/Swap/SwapModal';
import { WithdrawModal } from 'src/components/transactions/Withdraw/WithdrawModal';
import { BridgeModal } from 'src/components/transactions/Bridge/BridgeModal';
import { BackgroundDataProvider } from 'src/hooks/app-data-provider/BackgroundDataProvider';
import { AppDataProvider } from 'src/hooks/app-data-provider/useAppDataProvider';
import { ModalContextProvider } from 'src/hooks/useModal';
import { PermissionProvider } from 'src/hooks/usePermissions';
import { Web3ContextProvider } from 'src/libs/web3-data-provider/Web3Provider';
import { useRootStore } from 'src/store/root';
import { SharedDependenciesProvider } from 'src/ui-config/SharedDependenciesProvider';

import createEmotionCache from '../src/createEmotionCache';
import { AppGlobalStyles } from '../src/layouts/AppGlobalStyles';
import { LanguageProvider } from '../src/libs/LanguageProvider';
import Script from 'next/script';
import { ExitEarlyModal } from '../src/components/transactions/ExitEarly/ExitEarlyModal';
import { WithdrawVestZeroModal } from '../src/components/transactions/WithdrawVestZero/WithdrawVestZeroModal';
import { StakeVestModal } from '../src/components/transactions/StakeVests/StakeVestModal';
import { TransferVestsModal } from '../src/components/transactions/TransferVest/TransferVestsModal';
import { ClaimVestedTokenModal } from '../src/components/transactions/ClaimVestedTokens/ClaimVestedTokenModal';
import { ConvertEarlyZero } from '../src/components/transactions/ConvertEarlyZero/ConvertEarlyZeroModal';
import { LockZeroModal } from 'src/components/transactions/LockZero/LockZeroModal';
import { WithdrawLockZeroModal } from 'src/components/transactions/WithdrawLockZero/WithdrawLockZeroModal';
import { UnstakeZeroModal } from 'src/components/transactions/UnstakeZero/UnstakeZeroModal';
import { ClaimZEROLpIncentivesRewardsModal } from '../src/components/transactions/ClaimZEROLpIncentivesRewards/ClaimZEROLpIncentivesRewardsModal';
import { ClaimZEROLockerIncentivesModal } from '../src/components/transactions/ClaimZEROLockerIncentives/ClaimZEROLockerIncentivesModal';
import { ClaimZEROVestsModal } from '../src/components/transactions/ClaimZEROVests/ClaimZEROVestsModal';
import { ConvertGravityModal } from 'src/components/transactions/ConvertGravityPoints/ConvertGravityModal';
import { LinkReferralModal } from '../src/components/transactions/LinkReferralCode/LinkReferralModal';
import { getQueryParameter } from '../src/store/utils/queryParams';
import { LockedDLPModal } from 'src/components/transactions/LockedDLP/LockedDLPModal';
import { LockLPModal } from 'src/components/transactions/LockLP/LockLPModal';
import { NewLockZeroModal } from 'src/components/transactions/NewLockZero/NewLockZeroModal';
import { ClaimLPLockerIncentivesModal } from 'src/components/transactions/ClaimLPLockerIncentives/ClaimZEROLockerIncentivesModal';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getWeb3Library(provider: any): providers.Web3Provider {
  const library = new providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export const queryClient = new QueryClient();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  const initializeMixpanel = useRootStore((store) => store.initializeMixpanel);

  const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL;
  const SENTRY_TOKEN = process.env.NEXT_PUBLIC_SENTRY;

  useEffect(() => {
    Sentry.init({
      dsn: SENTRY_TOKEN,
      integrations: [new Sentry.BrowserTracing({}), new Sentry.Replay()],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  }, []);

  useEffect(() => {
    if (MIXPANEL_TOKEN) {
      initializeMixpanel();
    } else {
      console.log('no analytics tracking');
    }
  }, [MIXPANEL_TOKEN, initializeMixpanel]);

  const invite = getQueryParameter('invite');

  useEffect(() => {
    if (invite) localStorage.setItem('invite', invite);
  }, [invite]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Meta
        title={'Open Source Liquidity Protocol on Layer 2s'}
        description={
          'ZeroLend is an Open Source Protocol to create Non-Custodial Liquidity Markets to earn interest on supplying and borrowing assets with a variable or stable interest rate.'
        }
        imageUrl="https://i.imgur.com/KaP3sNh.png"
      />
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <Web3ReactProvider getLibrary={getWeb3Library}>
            <Web3ContextProvider>
              <AppGlobalStyles>
                <AddressBlocked>
                  <PermissionProvider>
                    <ModalContextProvider>
                      <BackgroundDataProvider>
                        <AppDataProvider>
                          <GasStationProvider>
                            <SharedDependenciesProvider>
                              <Script
                                async
                                src="https://www.googletagmanager.com/gtag/js?id=G-4BXYGRCH1M"
                              />
                              <Script
                                src="https://attribution.metacrm.inc/tracking-1-1-1.js”
                                data-entity-id=“661662c4265d2715bc8a1b19"
                                id="metacrm-tracking"
                                integrity="sha384-KVT0cdwbRt/fjdhbbEcHAVvFdtrAkBuvoip0q/+NDjPC73iAPNEkAXLkGOre5AUP"
                                crossOrigin="anonymous"
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                apiKey="mjrsl5d8kun"
                              ></Script>
                              <Script id="google-analytics">
                                {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-4BXYGRCH1M');`}
                              </Script>
                              <Script id="heap-analytics">
                                {`window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
                                  heap.load("1996362506");`}
                              </Script>
                              {/*cookie3*/}
                              <Script
                                src={"https://cdn.markfi.xyz/scripts/analytics/0.11.21/cookie3.analytics.min.js"}
                                integrity="sha384-wtYmYhbRlAqGwxc5Vb9GZVyp/Op3blmJICmXjRiJu2/TlPze5dHsmg2gglbH8viT"
                                crossOrigin="anonymous"
                                async
                                strategy="lazyOnload"
                                site-id="e2545317-4c8e-4d64-a05e-b6254193845c"
                              />
                              {getLayout(<Component {...pageProps} />)}
                              <SupplyModal />
                              <StakeZeroModal />
                              <ExitEarlyModal />
                              <WithdrawVestZeroModal />
                              <WithdrawModal />
                              <BorrowModal />
                              <RepayModal />
                              <CollateralChangeModal />
                              <RateSwitchModal />
                              <DebtSwitchModal />
                              <EmodeModal />
                              <SwapModal />
                              <FaucetModal />
                              {/*Vest Action Modal */}
                              <StakeVestModal />
                              <TransferVestsModal />
                              <ClaimVestedTokenModal />
                              {/*End*/}
                              {/*EarlyZero Action Modal */}
                              {/* <StakeEZeroModal /> */}
                              <ConvertEarlyZero />
                              <ConvertGravityModal />
                              {/*End*/}
                              {/* Zero Action Modal */}
                              <LockZeroModal />
                              <NewLockZeroModal />
                              <WithdrawLockZeroModal />
                              <UnstakeZeroModal />
                              {/*End*/}
                              {/* ZERO Rewards Modal*/}
                              <ClaimRewardsModal /> {/*EarlyZERO incentives*/}
                              <ClaimZEROLpIncentivesRewardsModal />
                              <ClaimZEROLockerIncentivesModal />
                              <ClaimLPLockerIncentivesModal />
                              <ClaimZEROVestsModal />
                              <LockedDLPModal />
                              <LockLPModal />
                              {/*End*/}
                              <MigrateV3Modal />
                              <BridgeModal />
                              <LinkReferralModal />
                              <TransactionEventHandler />
                              <SwitchModal />
                            </SharedDependenciesProvider>
                          </GasStationProvider>
                        </AppDataProvider>
                      </BackgroundDataProvider>
                    </ModalContextProvider>
                  </PermissionProvider>
                </AddressBlocked>
              </AppGlobalStyles>
            </Web3ContextProvider>
          </Web3ReactProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </LanguageProvider>
    </CacheProvider>
  );
}
