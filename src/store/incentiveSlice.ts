import {
  ReservesIncentiveDataHumanized,
  RewardInfoHumanized,
  UiIncentiveDataProvider,
  UserReservesIncentivesDataHumanized,
} from '@aave/contract-helpers';
import { StateCreator } from 'zustand';

import { RootStore } from './root';

// TODO: add chain/provider/account mapping
export interface IncentiveSlice {
  reserveIncentiveData?: ReservesIncentiveDataHumanized[];
  userIncentiveData?: UserReservesIncentivesDataHumanized[];
  refreshIncentiveData: () => Promise<void>;
}

export const createIncentiveSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  IncentiveSlice
> = (set, get) => ({
  refreshIncentiveData: async () => {
    const account = get().account;
    const currentMarketData = get().currentMarketData;
    const currentChainId = get().currentChainId;
    if (!currentMarketData.addresses.UI_INCENTIVE_DATA_PROVIDER) return;
    const poolDataProviderContract = new UiIncentiveDataProvider({
      uiIncentiveDataProviderAddress: currentMarketData.addresses.UI_INCENTIVE_DATA_PROVIDER,
      provider: get().jsonRpcProvider(),
      chainId: currentChainId,
    });
    const promises: Promise<void>[] = [];

    try {
      promises.push(
        poolDataProviderContract
          .getReservesIncentivesDataHumanized({
            lendingPoolAddressProvider: currentMarketData.addresses.LENDING_POOL_ADDRESS_PROVIDER,
          })
          .then((reserveIncentivesResponse) => {
            if (currentChainId !== 81457) return reserveIncentivesResponse;

            const modifyRtokens = (t: RewardInfoHumanized[]) => {
              return t
                .filter((tt) => Number(tt.emissionPerSecond) > 0)
                .map((tt) => {
                  if (tt.rewardTokenSymbol === 'GOLD') tt.rewardTokenSymbol = 'zBLAST-GOLD';
                  if (tt.rewardTokenSymbol === 'BLAST') tt.rewardTokenSymbol = 'zBLAST';
                  return tt;
                });
            };

            return reserveIncentivesResponse.map((r) => {
              return {
                ...r,
                aIncentiveData: {
                  ...r.aIncentiveData,
                  rewardsTokenInformation: modifyRtokens(r.aIncentiveData.rewardsTokenInformation),
                },
                vIncentiveData: {
                  ...r.vIncentiveData,
                  rewardsTokenInformation: modifyRtokens(r.vIncentiveData.rewardsTokenInformation),
                },
              };
            });
          })
          .then((reserveIncentiveData) => set({ reserveIncentiveData }))
      );
      if (account) {
        promises.push(
          poolDataProviderContract
            .getUserReservesIncentivesDataHumanized({
              lendingPoolAddressProvider: currentMarketData.addresses.LENDING_POOL_ADDRESS_PROVIDER,
              user: account,
            })
            .then((userIncentiveData) =>
              set({
                userIncentiveData,
              })
            )
        );
      }
      await Promise.all(promises);
    } catch (e) {
      console.log('error fetching incentives');
    }
  },
});
