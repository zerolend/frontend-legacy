import { Provider } from '@ethersproject/providers';
import { PoolVotingDataProvider } from 'src/contract-helpers/PoolVoting/pool-voting-services';
import { Hashable } from 'src/utils/types';

export class PoolVotingDataService implements Hashable {
  private readonly poolVotingDataService: PoolVotingDataProvider;

  constructor(
    provider: Provider,
    vestDataProviderAddress: string,
    public readonly chainId: number
  ) {
    this.poolVotingDataService = new PoolVotingDataProvider({
      uiStakeDataProvider: vestDataProviderAddress,
      provider,
    });
  }

  async getGeneralAllVotes(user: string) {
    return this.poolVotingDataService.getAllPools(user);
  }

  async setVote(poolAddress: string[], weight: number[]) {
    return this.poolVotingDataService.setVote(poolAddress, weight);
  }

  public toHash() {
    return this.chainId.toString();
  }
}
