import { UiStakeDataProviderContext } from '@aave/contract-helpers/src/uiStakeDataProvider-contract';
import { Contract, PopulatedTransaction } from 'ethers';
import { AirdropProviderFactory } from './AirdropProviderFactory';

export interface AirdropDataProviderInterface {
  getUserClaimed: (user: string, amount: string) => Promise<boolean>;
}

export class AirdropDataProvider implements AirdropDataProviderInterface {
  private readonly _contract: Contract;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = AirdropProviderFactory.connect(context.uiStakeDataProvider, context.provider);
  }

  public async getUserClaimed(user: string): Promise<boolean> {
    return await this._contract.rewardsClaimed(user);
  }

  public async setClaimReward(
    user: string,
    claimAmount: string,
    merkleProofs: string[],
    stakeNFT: boolean,
    lockUntil: number
  ): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.claim(
      user,
      claimAmount,
      merkleProofs,
      stakeNFT,
      lockUntil
    );
  }
}
