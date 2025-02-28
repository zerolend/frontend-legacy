import { UiStakeDataProviderContext } from '@aave/contract-helpers/src/uiStakeDataProvider-contract';
import { Contract, PopulatedTransaction } from 'ethers';
import { StakingBonusProviderFactory } from './StakingBonusProviderFactory';

export interface StakingBonusDataProviderInterface {
  setCreateLock: (
    amount: string,
    duration: number,
    isNFT: boolean
  ) => Promise<PopulatedTransaction>;
}

export class StakingBonusDataProvider implements StakingBonusDataProviderInterface {
  private readonly _contract: Contract;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = StakingBonusProviderFactory.connect(
      context.uiStakeDataProvider,
      context.provider
    );
  }
  public async setCreateLock(
    amount: string,
    duration: number,
    stakeNFT: boolean
  ): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.createLock(amount, duration, stakeNFT);
  }
}
