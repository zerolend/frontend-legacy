import { Provider } from '@ethersproject/providers';
import { Hashable } from 'src/utils/types';
import { EarlyZeroVestingDataProvider } from 'src/contract-helpers/EZeroVesting/eZero-vesting-services';
import { BigNumber } from 'bignumber.js';

type setStartVestingParams = {
  amount: BigNumber;
  stake: boolean;
};

export class EZeroDataService implements Hashable {
  private readonly eZeroDataService: EarlyZeroVestingDataProvider;

  constructor(
    provider: Provider,
    eZeroDataProviderAddress: string,
    public readonly chainId: number
  ) {
    this.eZeroDataService = new EarlyZeroVestingDataProvider({
      uiStakeDataProvider: eZeroDataProviderAddress,
      provider,
    });
  }

  async setStartVesting({ amount, stake }: setStartVestingParams) {
    return this.eZeroDataService.setStartVesting(amount, stake);
  }

  public toHash() {
    return this.chainId.toString();
  }
}
