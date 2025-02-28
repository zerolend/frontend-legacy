import { V3FaucetService } from '@aave/contract-helpers';
import { enableMapSet } from 'immer';
import { CustomMarket } from 'src/ui-config/marketsConfig';
import { ENABLE_TESTNET, STAGING_ENV } from 'src/utils/marketsAndNetworksConfig';
import create from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { AnalyticsSlice, createAnalyticsSlice } from './analyticsSlice';
import { createGhoSlice, GhoSlice } from './ghoSlice';
import { createGovernanceSlice, GovernanceSlice } from './governanceSlice';
import { createIncentiveSlice, IncentiveSlice } from './incentiveSlice';
import { createLayoutSlice, LayoutSlice } from './layoutSlice';
import { createPoolSlice, PoolSlice } from './poolSlice';
import { createProtocolDataSlice, ProtocolDataSlice } from './protocolDataSlice';
import { createTransactionsSlice, TransactionsSlice } from './transactionsSlice';
import { createSingletonSubscriber } from './utils/createSingletonSubscriber';
import { getQueryParameter } from './utils/queryParams';
import { createV3MigrationSlice, V3MigrationSlice } from './v3MigrationSlice';
import { createWalletDomainsSlice, WalletDomainsSlice } from './walletDomains';
import { createWalletSlice, WalletSlice } from './walletSlice';
import { createPaymasterSlice, PaymasterSlice } from './paymasterSlice';
import { createLockSlice, LockSlice } from './lockSlice';
import { ClaimRewardsSlice, createRewardsSlice } from './claimRewardsSlice';
import { createGaugeVoteSlice, GaugeVoteSlice } from './gaugeVoteSlice';
import { createVestSlice, VestSlice } from './vestSlice';
import { createBridgeSlice, BridgeSlice } from './bridgeSlice';

enableMapSet();

export type RootStore = ProtocolDataSlice &
  WalletSlice &
  PoolSlice &
  BridgeSlice &
  IncentiveSlice &
  GovernanceSlice &
  V3MigrationSlice &
  GhoSlice &
  WalletDomainsSlice &
  AnalyticsSlice &
  PaymasterSlice &
  TransactionsSlice &
  LayoutSlice &
  LockSlice &
  ClaimRewardsSlice &
  GaugeVoteSlice &
  VestSlice;

export const useRootStore = create<RootStore>()(
  subscribeWithSelector(
    devtools((...args) => {
      return {
        ...createPaymasterSlice(...args),
        ...createProtocolDataSlice(...args),
        ...createWalletSlice(...args),
        ...createBridgeSlice(...args),
        ...createPoolSlice(...args),
        ...createIncentiveSlice(...args),
        ...createGovernanceSlice(...args),
        ...createV3MigrationSlice(...args),
        ...createGhoSlice(...args),
        ...createWalletDomainsSlice(...args),
        ...createAnalyticsSlice(...args),
        ...createTransactionsSlice(...args),
        ...createLayoutSlice(...args),
        ...createLockSlice(...args),
        ...createRewardsSlice(...args),
        ...createGaugeVoteSlice(...args),
        ...createVestSlice(...args),
      };
    })
  )
);

// hydrate state from localeStorage to not break on ssr issues
if (typeof document !== 'undefined') {
  document.onreadystatechange = function () {
    if (document.readyState == 'complete') {
      const selectedMarket =
        getQueryParameter('marketName') || localStorage.getItem('selectedMarket');

      if (selectedMarket) {
        const currentMarket = useRootStore.getState().currentMarket;
        const setCurrentMarket = useRootStore.getState().setCurrentMarket;
        if (selectedMarket !== currentMarket) {
          setCurrentMarket(selectedMarket as CustomMarket, true);
        }
      }

      const code = getQueryParameter('invite') || localStorage.getItem('invite');

      if (code) {
        const currentInvite = useRootStore.getState().invite;
        const setInvite = useRootStore.getState().setInvite;
        if (currentInvite !== code) {
          setInvite(code);
        }
      }
    }
  };
}

export const usePoolDataSubscription = createSingletonSubscriber(() => {
  return useRootStore.getState().refreshPoolData();
}, 60000);

export const usePoolDataV3Subscription = createSingletonSubscriber(() => {
  return useRootStore.getState().refreshPoolV3Data();
}, 60000);

export const useIncentiveDataSubscription = createSingletonSubscriber(() => {
  return useRootStore.getState().refreshIncentiveData();
}, 60000);

export const useGhoDataSubscription = createSingletonSubscriber(() => {
  return useRootStore.getState().refreshGhoData();
}, 60000);

export const useOracleDataSubscription = createSingletonSubscriber(() => {
  return useRootStore.getState().refreshOraclePrice();
}, 60000);

export const useRewardRateSubscription = createSingletonSubscriber(() => {
  return useRootStore.getState().setRewardData();
}, 600000);

export const useLPRewardRateSubscription = createSingletonSubscriber(() => {
  return useRootStore.getState().setLPRewardData();
}, 600000);

export const useIsClaimedSubscription = createSingletonSubscriber(() => {
  return useRootStore.getState().setIsClaimed();
}, 10000);

export const useFetchMerkleSubscription = createSingletonSubscriber(() => {
  return useRootStore.getState().setMerkleAPR();
}, 600000);

let latest: V3FaucetService;

useRootStore.subscribe(
  (state) => state.currentMarketData,
  async (selected) => {
    const { setIsFaucetPermissioned: setFaucetPermissioned, jsonRpcProvider } =
      useRootStore.getState();
    if (ENABLE_TESTNET || STAGING_ENV) {
      if (!selected.v3) {
        setFaucetPermissioned(false);
        return;
      }

      // If there are multiple calls in flight, we only want to use the result from the latest one.
      // Use the instance of the service to check if it's the latest one since it is recreated
      // everytime this subscription fires.
      const service = new V3FaucetService(jsonRpcProvider(), selected.addresses.FAUCET);
      latest = service;
      service
        .isPermissioned()
        .then((isPermissioned) => {
          if (latest === service) {
            setFaucetPermissioned(isPermissioned);
          }
        })
        .catch(() => {
          // console.error('error checking faucet permission', e);
          setFaucetPermissioned(false);
        });
    } else {
      setFaucetPermissioned(false);
    }
  },
  { fireImmediately: true }
);

useRootStore.subscribe(
  (state) => state.account,
  (account) => {
    if (account) {
      useRootStore.getState().fetchConnectedWalletDomains();
    } else {
      useRootStore.getState().clearWalletDomains();
    }
  },
  { fireImmediately: true }
);
