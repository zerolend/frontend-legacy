import { UiStakeDataProviderContext } from '@aave/contract-helpers/src/uiStakeDataProvider-contract';
import { BigNumber, Contract } from 'ethers';
import { OracleProviderFactory } from './OracleProviderFactory';

export interface OracleDataProviderInterface {
  getLatestAnswer: () => Promise<BigNumber>;
}

export class OracleDataProvider implements OracleDataProviderInterface {
  private readonly _contract: Contract;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = OracleProviderFactory.connect(context.uiStakeDataProvider, context.provider);
  }

  public async getLatestAnswer(): Promise<BigNumber> {
    return await this._contract.latestAnswer();
  }
}
