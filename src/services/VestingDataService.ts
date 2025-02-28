import { Provider } from '@ethersproject/providers';
import { Hashable } from 'src/utils/types';
import { VestingDataProvider } from '../contract-helpers/ZeroVesting/vesting-services';

type GetUserVestUIDataHumanizedParams = {
  user: string;
};

export class VestDataService implements Hashable {
  private readonly vestDataService: VestingDataProvider;

  constructor(
    provider: Provider,
    vestDataProviderAddress: string,
    public readonly chainId: number
  ) {
    this.vestDataService = new VestingDataProvider({
      uiStakeDataProvider: vestDataProviderAddress,
      provider,
    });
  }

  async getGeneralVestUIDataHumanized({ user }: GetUserVestUIDataHumanizedParams) {
    const r = await this.vestDataService.getUserVestingData({ user });
    return r;
  }

  async setClaimSingleReward(tokenId: number) {
    return this.vestDataService.setClaimSingleReward(tokenId);
  }

  async setClaimAllRewards(tokenIds: number[]) {
    return this.vestDataService.setClaimAllRewards(tokenIds);
  }

  async setStakeNFT(from: string, to: string, nftId: number, data: string) {
    return this.vestDataService.setStakeNFT(from, to, nftId, data);
  }

  async setTransferNFT(from: string, to: string, nftId: number) {
    return this.vestDataService.setTransferNFT(from, to, nftId);
  }

  public toHash() {
    return this.chainId.toString();
  }
}
