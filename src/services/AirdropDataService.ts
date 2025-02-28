import { Provider } from '@ethersproject/providers';
import { Hashable } from 'src/utils/types';
import { AirdropDataProvider } from 'src/contract-helpers/AirDrop/airdrop-services';

type setClaimRewardParam = {
  user: string;
  claimAmount: string;
  merkleProofs: string[];
  stakeNFT: boolean;
  lockUntil: number;
};

export class AirdropDataService implements Hashable {
  private readonly airdropDataService: AirdropDataProvider;

  constructor(
    provider: Provider,
    airdropDataProviderAddress: string,
    public readonly chainId: number
  ) {
    this.airdropDataService = new AirdropDataProvider({
      uiStakeDataProvider: airdropDataProviderAddress,
      provider,
    });
  }

  public async getUserRewardClaimed(user: string) {
    return await this.airdropDataService.getUserClaimed(user);
  }

  public async setClaimRewards({
    user,
    claimAmount,
    merkleProofs,
    stakeNFT,
    lockUntil,
  }: setClaimRewardParam) {
    return await this.airdropDataService.setClaimReward(
      user,
      claimAmount,
      merkleProofs,
      stakeNFT,
      lockUntil
    );
  }

  public toHash() {
    return this.chainId.toString();
  }
}
