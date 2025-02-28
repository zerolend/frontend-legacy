import { UiStakeDataProviderContext } from '@aave/contract-helpers/src/uiStakeDataProvider-contract';
import { Contract, PopulatedTransaction } from 'ethers';
import { LockLPProviderFactory } from './LockLPProviderFactory';

export interface LockLPDataProviderInterface {
  setCreateLock: (
    amount: string,
    duration: number,
    isNFT: boolean
  ) => Promise<PopulatedTransaction>;

  setWithdrawLock: (tokenId: number) => Promise<PopulatedTransaction>;
}

export class LockLPDataProvider implements LockLPDataProviderInterface {
  private readonly _contract: Contract;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = LockLPProviderFactory.connect(context.uiStakeDataProvider, context.provider);
  }

  public async setCreateLock(
    amount: string,
    duration: number,
    stakeNFT: boolean
  ): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.createLock(amount, duration, stakeNFT);
  }

  public async setWithdrawLock(tokenId: number): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.withdraw(tokenId);
  }
}
