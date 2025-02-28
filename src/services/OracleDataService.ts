import { Provider } from '@ethersproject/providers';
import { Hashable } from 'src/utils/types';
import { OracleDataProvider } from 'src/contract-helpers/Oracle/oracle-services';

export class OracleDataService implements Hashable {
  private readonly oracleDataService: OracleDataProvider;

  constructor(
    provider: Provider,
    airdropDataProviderAddress: string,
    public readonly chainId: number
  ) {
    this.oracleDataService = new OracleDataProvider({
      uiStakeDataProvider: airdropDataProviderAddress,
      provider,
    });
  }

  public async getLatestAnswer() {
    return await this.oracleDataService.getLatestAnswer();
  }

  public toHash() {
    return this.chainId.toString();
  }
}
