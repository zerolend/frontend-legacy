import { Provider } from '@ethersproject/providers';
import { Hashable } from 'src/utils/types';
import { OmniStakingDataProvider } from 'src/contract-helpers/OmniStaking/omni-staking-services';

export class OmniStakingDataService implements Hashable {
  private readonly omniStakingDataService: OmniStakingDataProvider;

  constructor(
    provider: Provider,
    lockDataProviderAddress: string,
    public readonly chainId: number
  ) {
    this.omniStakingDataService = new OmniStakingDataProvider({
      uiStakeDataProvider: lockDataProviderAddress,
      provider,
    });
  }

  async getRewardRate() {
    return await this.omniStakingDataService.getRewardRate();
  }

  async getTotalSupply() {
    return await this.omniStakingDataService.getTotalSupply();
  }

  async setUnstakeNFT(tokenId: number) {
    return await this.omniStakingDataService.unStake(tokenId);
  }

  async setUnstakeandWithdraw(tokenId: number) {
    return await this.omniStakingDataService.unStakeandWithdraw(tokenId);
  }

  async getEarnedValue(user: string) {
    return await this.omniStakingDataService.getEarnedValue(user);
  }

  async claimReward() {
    return await this.omniStakingDataService.getReward();
  }

  async getVotingPower(user: string) {
    return await this.omniStakingDataService.getBalanceOf(user);
  }

  async getStakedSupply(user: string) {
    return await this.omniStakingDataService.getStakedSupply(user);
  }
  public toHash() {
    return this.chainId.toString();
  }
}
