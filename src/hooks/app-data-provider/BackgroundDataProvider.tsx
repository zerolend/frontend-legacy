import React, { useContext } from 'react';
import {
  useGhoDataSubscription,
  useIncentiveDataSubscription,
  useIsClaimedSubscription,
  useOracleDataSubscription,
  usePoolDataSubscription,
  useRewardRateSubscription,
  useLPRewardRateSubscription,
  useFetchMerkleSubscription,
} from 'src/store/root';

interface BackgroundDataProviderContextType {
  refetchGhoData: () => Promise<void>;
  refetchIncentiveData?: () => Promise<void>;
  refetchPoolData?: () => Promise<void> | Promise<void[]>;
  refetchOracle?: () => Promise<void>;
  refetchRewardRates?: () => Promise<void>;
  refetchLPRewardRates?: () => Promise<void>;
  refetchIsClaimed?: () => Promise<void>;
  refetchMerkle?: () => Promise<void>;
}

const BackgroundDataProviderContext = React.createContext<BackgroundDataProviderContextType>(
  {} as BackgroundDataProviderContextType
);

/**
 * Naive provider that subscribes to different data sources.
 * This context provider will run useEffects that relate to instantiating subscriptions as a poll every 60s to consistently fetch data from on-chain and update the Zustand global store.
 * @returns
 */
export const BackgroundDataProvider: React.FC = ({ children }) => {
  const refetchPoolData = usePoolDataSubscription();
  const refetchIncentiveData = useIncentiveDataSubscription();
  const refetchGhoData = useGhoDataSubscription();
  const refetchOracle = useOracleDataSubscription();
  const refetchRewardRates = useRewardRateSubscription();
  const refetchLPRewardRates = useLPRewardRateSubscription();
  const refetchIsClaimed = useIsClaimedSubscription();
  const refetchMerkle = useFetchMerkleSubscription();
  return (
    <BackgroundDataProviderContext.Provider
      value={{
        refetchIncentiveData,
        refetchPoolData,
        refetchGhoData,
        refetchOracle,
        refetchRewardRates,
        refetchLPRewardRates,
        refetchIsClaimed,
        refetchMerkle,
      }}
    >
      {children}
    </BackgroundDataProviderContext.Provider>
  );
};

export const useBackgroundDataProvider = () => useContext(BackgroundDataProviderContext);
