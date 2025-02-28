import { Provider } from '@ethersproject/providers';
import { Hashable } from 'src/utils/types';
import { VestUIDataProvider } from '../contract-helpers/UIProvider/vest-ui-services';

export class VestUIDataService implements Hashable {
  private readonly vestUIDataService: VestUIDataProvider;

  constructor(
    provider: Provider,
    vestDataProviderAddress: string,
    public readonly chainId: number
  ) {
    this.vestUIDataService = new VestUIDataProvider({
      uiStakeDataProvider: vestDataProviderAddress,
      provider,
    });
  }

  async getGeneralVestUIDataHumanized(user: string) {
    return this.vestUIDataService.getUserVestingData(user);
  }

  async getGenralStakeUIDataHumanized(user: string) {
    return this.vestUIDataService.getUserLockData(user);
  }

  async getGenralLPLockUIDataHumanized(user: string) {
    return this.vestUIDataService.getUserLPLockData(user);
  }

  public toHash() {
    return this.chainId.toString();
  }
}
