import { createContext, useContext } from 'react';
import { GovernanceService } from 'src/services/GovernanceService';
import { WalletBalanceService } from 'src/services/WalletBalanceService';
import { useRootStore } from 'src/store/root';
import { getProvider } from 'src/utils/marketsAndNetworksConfig';
import invariant from 'tiny-invariant';
import { governanceConfig } from './governanceConfig';
import { zeroConfig } from './zeroConfig';
import { VestDataService } from '../services/VestingDataService';
import { LockDataService } from 'src/services/LockDataService';
import { PoolVotingDataService } from 'src/services/PoolVotingDataService';
import { OmniStakingDataService } from 'src/services/OmniStakingDataService';
import { AirdropDataService } from 'src/services/AirdropDataService';
import { OracleDataService } from 'src/services/OracleDataService';
import { VestUIDataService } from 'src/services/VestUIDataService';
import { OmniLPStakingDataService } from 'src/services/OmniLPStakingDataService';
import { ERC20Service } from '@aave/contract-helpers';

interface SharedDependenciesContext {
  governanceService: GovernanceService;
  governanceWalletBalanceService: WalletBalanceService;
  poolTokensBalanceService: WalletBalanceService;
  tokenBalanceService: WalletBalanceService;
  vestingDataService: VestDataService;
  lockDataService: LockDataService;
  poolVotingDataService: PoolVotingDataService;
  omniStakingDataService: OmniStakingDataService;
  airdropDataService: AirdropDataService;
  erc20Service: ERC20Service
  oracleDataService: OracleDataService;
  vestUIDataService: VestUIDataService;
  omniLPStakingDataService: OmniLPStakingDataService;
}

const SharedDependenciesContext = createContext<SharedDependenciesContext | null>(null);

export const SharedDependenciesProvider: React.FC = ({ children }) => {
  const currentNetworkConfig = useRootStore((state) => state.currentNetworkConfig);
  const currentMarketData = useRootStore((state) => state.currentMarketData);
  const isGovernanceFork =
    currentNetworkConfig.isFork &&
    currentNetworkConfig.underlyingChainId === governanceConfig.chainId;

  const governanceChainId = isGovernanceFork ? currentMarketData.chainId : governanceConfig.chainId;

  // providers
  const currentProvider = getProvider(currentMarketData.chainId);
  const governanceProvider = currentProvider;
  const vestingProvider = getProvider(zeroConfig.chainId);
  const lockProvider = getProvider(zeroConfig.chainId);
  const poolVotingProvider = getProvider(zeroConfig.chainId);
  const omniStakingProvider = getProvider(zeroConfig.chainId);

  const airdopProvider = getProvider(zeroConfig.chainId);
  const oracleProvider = getProvider(zeroConfig.chainId);
  const vestUIProvider = getProvider(zeroConfig.chainId);
  const omniLPStakingProvider = getProvider(zeroConfig.chainId);

  // services
  const governanceService = new GovernanceService(governanceProvider, governanceChainId);
  const governanceWalletBalanceService = new WalletBalanceService(
    governanceProvider,
    governanceConfig.walletBalanceProvider,
    governanceChainId
  );
  const erc20Service = new ERC20Service(currentProvider)
  const poolTokensBalanceService = new WalletBalanceService(
    currentProvider,
    currentMarketData.addresses.WALLET_BALANCE_PROVIDER,
    currentMarketData.chainId
  );
  const tokenBalanceService = new WalletBalanceService(
    currentProvider,
    currentMarketData.addresses.WALLET_BALANCE_PROVIDER,
    currentMarketData.chainId
  );

  const vestingDataService = new VestDataService(
    vestingProvider,
    zeroConfig.crossChainAddresses[zeroConfig.chainId].VESTING_ADDRESS,
    zeroConfig.chainId
  );
  const lockDataService = new LockDataService(
    lockProvider,
    zeroConfig.crossChainAddresses[zeroConfig.chainId].LOCKER_TOKEN,
    zeroConfig.chainId
  );

  const poolVotingDataService = new PoolVotingDataService(
    poolVotingProvider,

    zeroConfig.governance.POOL_VOTER,
    zeroConfig.chainId
  );

  const omniStakingDataService = new OmniStakingDataService(
    omniStakingProvider,
    zeroConfig.crossChainAddresses[zeroConfig.chainId].OMNI_STAKING,
    zeroConfig.chainId
  );


  const airdropDataService = new AirdropDataService(
    airdopProvider,
    zeroConfig.governance.ZERO_AIRDROP,
    zeroConfig.chainId
  );

  const oracleDataService = new OracleDataService(
    oracleProvider,
    zeroConfig.crossChainAddresses[zeroConfig.chainId].ORACLE_ADDRESS,
    zeroConfig.chainId
  );

  const vestUIDataService = new VestUIDataService(
    vestUIProvider,
    zeroConfig.crossChainAddresses[zeroConfig.chainId].VESTING_UI_PROVIDER,
    currentMarketData.chainId
  );

  const omniLPStakingDataService = new OmniLPStakingDataService(
    omniLPStakingProvider,
    zeroConfig.crossChainAddresses[zeroConfig.chainId].OMNI_STAKING_LP,
    zeroConfig.chainId
  );

  return (
    <SharedDependenciesContext.Provider
      value={{
        governanceService,
        governanceWalletBalanceService,
        poolTokensBalanceService,
        tokenBalanceService,
        vestingDataService,
        lockDataService,
        poolVotingDataService,
        omniStakingDataService,
        airdropDataService,
        oracleDataService,
        erc20Service,
        vestUIDataService,
        omniLPStakingDataService,
      }}
    >
      {children}
    </SharedDependenciesContext.Provider>
  );
};

export const useSharedDependencies = () => {
  const context = useContext(SharedDependenciesContext);
  invariant(context, 'Component should be wrapper inside a <SharedDependenciesProvider />');
  return context;
};
