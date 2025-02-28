import { StateCreator } from 'zustand';

import { RootStore } from './root';
import { PopulatedTransaction, ethers } from 'ethers';
import { VestDataService } from 'src/services/VestingDataService';
import { zeroConfig } from 'src/ui-config/zeroConfig';

export interface VestSlice {
  stakeVestNFT: (args: {
    nftId: number;
    duration: number;
    stakeNFT: boolean;
  }) => Promise<PopulatedTransaction>;

  TransferNFT: (args: { nftId: number }) => Promise<PopulatedTransaction>;
}

export const createVestSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  VestSlice
> = (_, get) => {
  return {
    stakeVestNFT: async (args: { nftId: number; duration: number; stakeNFT: boolean }) => {
      const encoder = new ethers.utils.AbiCoder();
      const provider = get().jsonRpcProvider();
      const vestDataService = new VestDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].VESTING_ADDRESS,
        zeroConfig.chainId
      );

      const data = encoder.encode(
        ['bool', 'address', 'uint256'],
        [args.stakeNFT, get().account, args.duration]
      );

      return await vestDataService.setStakeNFT(
        get().account,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].STAKING_BONUS,
        args.nftId,
        data
      );
    },

    TransferNFT: async (args: { nftId: number }) => {
      const provider = get().jsonRpcProvider();
      const chainId = get().currentChainId;
      const vestDataService = new VestDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].VESTING_ADDRESS,
        chainId
      );

      return await vestDataService.setTransferNFT(
        get().account,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].OMNI_STAKING,
        args.nftId
      );
    },
  };
};
