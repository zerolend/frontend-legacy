import { Provider } from '@ethersproject/providers';
import { Hashable } from 'src/utils/types';
import { LockLPDataProvider } from 'src/contract-helpers/LockLP/locking-lp-services';

type setCreateLockParams = {
  amount: string;
  duration: number;
  stakeNFT: boolean;
};

export class LockLPDataService implements Hashable {
  private readonly lockDataService: LockLPDataProvider;

  constructor(
    provider: Provider,
    lockDataProviderAddress: string,
    public readonly chainId: number
  ) {
    this.lockDataService = new LockLPDataProvider({
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

  public toHash() {
    return this.chainId.toString();
  }
}
