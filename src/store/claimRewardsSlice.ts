import { StateCreator } from 'zustand';

import { RootStore } from './root';
import { PopulatedTransaction } from 'ethers';
import { VestDataService } from 'src/services/VestingDataService';
import { AirdropDataService } from 'src/services/AirdropDataService';
import { OmniStakingDataService } from 'src/services/OmniStakingDataService';
import { zeroConfig } from 'src/ui-config/zeroConfig';
import { getProvider } from 'src/utils/marketsAndNetworksConfig';
import { OmniLPStakingDataService } from 'src/services/OmniLPStakingDataService';

export interface ClaimRewardsSlice {
  isClaimed: boolean;

  setIsClaimed: (value?: boolean) => Promise<void>;

  claimSingleVestReward: (args: { tokenId: number }) => Promise<PopulatedTransaction>;

  claimAllVestRewards: (args: { tokenIds: number[] }) => Promise<PopulatedTransaction>;

  claimAirdrop: (args: {
    user: string;
    claimAmount: string;
    merkleProof: string[];
    stakeNFT: boolean;
    lockUntil: number;
  }) => Promise<PopulatedTransaction>;

  claimStakingReward: () => Promise<PopulatedTransaction>;

  claimStakingLPReward: () => Promise<PopulatedTransaction>;
}

export const createRewardsSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  ClaimRewardsSlice
> = (set, get) => {
  return {
    isClaimed: false,
    claimSingleVestReward: async (args: { tokenId: number }) => {
      const provider = getProvider(zeroConfig.chainId);
      const vestingDataService = new VestDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].VESTING_ADDRESS,
        zeroConfig.chainId
      );

      return await vestingDataService.setClaimSingleReward(args.tokenId);
    },

    claimAllVestRewards: async (args: { tokenIds: number[] }) => {
      const provider = getProvider(zeroConfig.chainId);
      const vestingDataService = new VestDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].VESTING_ADDRESS,
        zeroConfig.chainId
      );

      return await vestingDataService.setClaimAllRewards(args.tokenIds);
    },

    claimAirdrop: async (args: {
      user: string;
      claimAmount: string;
      merkleProof: string[];
      stakeNFT: boolean;
      lockUntil: number;
    }) => {
      const provider = getProvider(zeroConfig.chainId);
      const airdropDataService = new AirdropDataService(
        provider,
        zeroConfig.governance.ZERO_AIRDROP,
        zeroConfig.chainId
      );

      return await airdropDataService.setClaimRewards({
        user: args.user,
        claimAmount: args.claimAmount,
        merkleProofs: args.merkleProof,
        stakeNFT: args.stakeNFT,
        lockUntil: args.lockUntil,
      });
    },
    setIsClaimed: async (value?: boolean) => {
      if (get().isClaimed) return;

      if (value) {
        set({
          isClaimed: value,
        });
      }

      const provider = getProvider(zeroConfig.chainId);

      const airdropDataService = new AirdropDataService(
        provider,
        zeroConfig.governance.ZERO_AIRDROP,
        zeroConfig.chainId
      );

      const isClaimedCheck = await airdropDataService.getUserRewardClaimed(get().account);

      set({
        isClaimed: isClaimedCheck,
      });
    },
    claimStakingReward: async () => {
      const provider = getProvider(zeroConfig.chainId);
      const omniStakingDataService = new OmniStakingDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].OMNI_STAKING,
        zeroConfig.chainId
      );

      return await omniStakingDataService.claimReward();
    },
    claimStakingLPReward: async () => {
      const provider = getProvider(zeroConfig.chainId);
      const omniLPStakingDataService = new OmniLPStakingDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].OMNI_STAKING_LP,
        zeroConfig.chainId
      );

      return await omniLPStakingDataService.claimReward();
    },
  };
};
