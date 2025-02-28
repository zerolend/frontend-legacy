import { Provider } from '@ethersproject/providers';
import { OracleLPDataProvider } from 'src/contract-helpers/OracleLP/oracle-lp-services';
import { Hashable } from 'src/utils/types';

export class OracleLPDataService implements Hashable {
  private readonly OracleLPDataService: OracleLPDataProvider;

  constructor(
    provider: Provider,
    airdropDataProviderAddress: string,
    public readonly chainId: number
  ) {
    this.OracleLPDataService = new OracleLPDataProvider({
      uiStakeDataProvider: airdropDataProviderAddress,
      provider,
    });
  }

  public async getPrice() {
    return await this.OracleLPDataService.getPrice();
  }

  public toHash() {
    return this.chainId.toString();
  }
}
