import { StateCreator } from 'zustand';

import { RootStore } from './root';
import { PopulatedTransaction } from 'ethers';
import { PoolVotingDataService } from 'src/services/PoolVotingDataService';
import { zeroConfig } from 'src/ui-config/zeroConfig';

export interface GaugeVoteSlice {
  creatVote: (args: { pool: string[]; weight: number[] }) => Promise<PopulatedTransaction>;
}

export const createGaugeVoteSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  GaugeVoteSlice
> = (_, get) => {
  return {
    creatVote: async (args: { pool: string[]; weight: number[] }) => {
      const provider = get().jsonRpcProvider();

      const gaugeVoteDataService = new PoolVotingDataService(
        provider,
        zeroConfig.governance.POOL_VOTER,
        zeroConfig.chainId
      );

      return await gaugeVoteDataService.setVote(args.pool, args.weight);
    },
  };
};
