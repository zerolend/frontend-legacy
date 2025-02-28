import { UiStakeDataProviderContext } from '@aave/contract-helpers/src/uiStakeDataProvider-contract';
import { Contract, PopulatedTransaction } from 'ethers';
import { EarlyZeroVestingProvider } from './EarlyZeroVestingProvider';
import { ERC20Service, IERC20ServiceInterface } from '@aave/contract-helpers';
import { BigNumber } from 'bignumber.js';

export interface EarlyZeroVestingDataProviderInterface {
  setStartVesting: (amount: BigNumber, stake: boolean) => Promise<PopulatedTransaction>;
}

export class EarlyZeroVestingDataProvider implements EarlyZeroVestingDataProviderInterface {
  private readonly _contract: Contract;

  readonly erc20Service: IERC20ServiceInterface;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = EarlyZeroVestingProvider.connect(
      context.uiStakeDataProvider,
      context.provider
    );

    this.erc20Service = new ERC20Service(context.provider);
  }

  public async setStartVesting(amount: BigNumber, stake: boolean): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.startVesting(amount, stake);
  }
}
