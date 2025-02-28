import { UiStakeDataProviderContext } from '@aave/contract-helpers/src/uiStakeDataProvider-contract';
import { BigNumber, Contract } from 'ethers';
import { OracleLPProviderFactory } from './OracleLPProviderFactory';

export interface OracleLPDataProviderInterface {
  getPrice: () => Promise<BigNumber>;
}

export class OracleLPDataProvider implements OracleLPDataProviderInterface {
  private readonly _contract: Contract;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = OracleLPProviderFactory.connect(context.uiStakeDataProvider, context.provider);
  }

  public async getPrice(): Promise<BigNumber> {
    return await this._contract.getPrice();
  }
}
