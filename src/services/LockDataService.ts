import { Provider } from '@ethersproject/providers';
import { Hashable } from 'src/utils/types';
import { LockDataProvider } from 'src/contract-helpers/LockZero/locking-services';

type setCreateLockParams = {
  amount: string;
  duration: number;
  stakeNFT: boolean;
};

export class LockDataService implements Hashable {
  private readonly lockDataService: LockDataProvider;

  constructor(
    provider: Provider,
    lockDataProviderAddress: string,
    public readonly chainId: number
  ) {
    this.lockDataService = new LockDataProvider({
      uiStakeDataProvider: lockDataProviderAddress,
      provider,
    });
  }

  async setGeneralCreateLock({ amount, duration, stakeNFT }: setCreateLockParams) {
    return this.lockDataService.setCreateLock(amount, duration, stakeNFT);
  }

  async setGeneralWithdrawLock(tokenId: number) {
    return this.lockDataService.setWithdrawLock(tokenId);
  }

  async getNFTAllowance(nftId: number) {
    return this.lockDataService.generateNFTAllowance(nftId);
  }

  async setNFTApproval(to: string, nftId: number) {
    return this.lockDataService.setApproveNFT(to, nftId);
  }

  async setStakeNFT(from: string, to: string, nftId: number) {
    return this.lockDataService.setStakeNFT(from, to, nftId);
  }

  public toHash() {
    return this.chainId.toString();
  }
}
