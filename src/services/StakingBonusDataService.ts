import { Provider } from '@ethersproject/providers';
import { StakingBonusDataProvider } from 'src/contract-helpers/StakingBonus/staking-bonus-services';
import { Hashable } from 'src/utils/types';

type setCreateLockParams = {
  amount: string;
  duration: number;
  stakeNFT: boolean;
};

export class StakingBonusDataService implements Hashable {
  private readonly stakingBonusDataService: StakingBonusDataProvider;

  constructor(
    provider: Provider,
    stakingBonusDataProviderAddress: string,
    public readonly chainId: number
  ) {
    this.stakingBonusDataService = new StakingBonusDataProvider({
      uiStakeDataProvider: stakingBonusDataProviderAddress,
      provider,
    });
  }

  async setGeneralCreateLock({ amount, duration, stakeNFT }: setCreateLockParams) {
    return this.stakingBonusDataService.setCreateLock(amount, duration, stakeNFT);
  }

  public toHash() {
    return this.chainId.toString();
  }
}
