import { UiStakeDataProviderContext } from '@aave/contract-helpers/src/uiStakeDataProvider-contract';
import { Contract, PopulatedTransaction } from 'ethers';
import { ZAPDlpProviderFactory } from './ZAPDlpProviderFactory';

export interface ZAPDlpDataProviderInterface {
  setZapAndStake: (
    amount: string,
    duration: number,
    odosSwapData: string
  ) => Promise<PopulatedTransaction>;
}

export class ZAPDlpDataProvider implements ZAPDlpDataProviderInterface {
  private readonly _contract: Contract;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = ZAPDlpProviderFactory.connect(context.uiStakeDataProvider, context.provider);
  }

  public async setZapAndStake(
    amount: string,
    duration: number,
    odosSwapData: string
  ): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.zapAndStake(duration, 0, 0, odosSwapData, {
      value: amount,
    });
  }
}
