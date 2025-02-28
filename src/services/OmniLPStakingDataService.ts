import { Provider } from '@ethersproject/providers';
import { Hashable } from 'src/utils/types';
import { OmniLPStakingDataProvider } from 'src/contract-helpers/OmniLPStaking/omni-lp-staking-services';

export class OmniLPStakingDataService implements Hashable {
  private readonly omniLPStakingDataService: OmniLPStakingDataProvider;

  constructor(
    provider: Provider,
    lockDataProviderAddress: string,
    public readonly chainId: number
  ) {
    this.omniLPStakingDataService = new OmniLPStakingDataProvider({
      uiStakeDataProvider: lockDataProviderAddress,
      provider,
    });
  }

  async setUnstakeandWithdraw(tokenId: number) {
    return await this.omniLPStakingDataService.unStakeandWithdraw(tokenId);
  }

  async getRewardRate() {
    return await this.omniLPStakingDataService.getRewardRate();
  }

  async getTotalSupply() {
    return await this.omniLPStakingDataService.getTotalSupply();
  }

  async getEarnedValue(user: string) {
    return await this.omniLPStakingDataService.getEarnedValue(user);
  }

  async claimReward() {
    return await this.omniLPStakingDataService.getRewardETH();
  }

  public toHash() {
    return this.chainId.toString();
  }

  async claimRewardETH() {
    return await this.omniLPStakingDataService.getRewardETH();
  }

  async getVotingPower(user: string) {
    return await this.omniLPStakingDataService.getBalanceOf(user);
  }

  async getStakedSupply(user: string) {
    return await this.omniLPStakingDataService.getStakedSupply(user);
  }
}
