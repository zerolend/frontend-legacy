import { UiStakeDataProviderContext } from '@aave/contract-helpers/src/uiStakeDataProvider-contract';
import { Contract, PopulatedTransaction } from 'ethers';
import { PoolVotingProviderFactory } from './PoolVotingProviderFactory';
import { IGuageData } from 'src/modules/gaugeVote/GaugeVotePoolList';

interface PoolVotingDataProviderInterface {
  getPoolWeights: () => void;

  getUserVotes: (user: string) => void;

  getPools: () => void;

  getTotalWeight: () => void;

  getAllPools: (user: string) => void;

  setVote: (poolAddress: string[], weight: number[]) => Promise<PopulatedTransaction>;
}

export class PoolVotingDataProvider implements PoolVotingDataProviderInterface {
  private readonly _contract: Contract;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = PoolVotingProviderFactory.connect(
      context.uiStakeDataProvider,
      context.provider
    );
  }

  public async getPoolWeights() {
    return await this._contract.getPoolWeights();
  }

  public async getUserVotes(user: string) {
    return await this._contract.getUserVotes(user);
  }

  public async getPools() {
    return await this._contract.pools();
  }

  public async getTotalWeight() {
    return await this._contract.totalWeight();
  }

  public async getAllPools(user: string) {
    const getPools: IGuageData[] = [];
    const weights = await this.getPoolWeights();
    const votes = await this.getUserVotes(user);
    const pools = await this.getPools();

    for (let i = 0; i < pools.length; i++) {
      getPools.push({
        poolName: 'XYZ/ABC',
        poolAddress: pools[i],
        apr: 0,
        overallVotes: weights[i].toString(),
        yourVotes: votes[i].toString(),
      });
    }

    return getPools;
  }

  public async setVote(poolAddress: string[], weight: number[]): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.vote(poolAddress, weight);
  }
}
