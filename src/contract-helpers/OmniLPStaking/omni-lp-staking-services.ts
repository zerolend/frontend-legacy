import { UiStakeDataProviderContext } from '@aave/contract-helpers/src/uiStakeDataProvider-contract';
import { BigNumber, Contract, PopulatedTransaction } from 'ethers';
import { OmniLPStakingProviderFactory } from './OmniLPStakingProviderFactory';

export interface OmniLPStakingDataProviderInterface {
  unStakeandWithdraw: (tokenId: number) => Promise<PopulatedTransaction>;

  getRewardRate: () => Promise<BigNumber>;

  getTotalSupply: () => Promise<BigNumber>;

  getEarnedValue: (user: string) => Promise<BigNumber>;

  getRewardETH: () => Promise<PopulatedTransaction>;
}

export class OmniLPStakingDataProvider implements OmniLPStakingDataProviderInterface {
  private readonly _contract: Contract;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = OmniLPStakingProviderFactory.connect(
      context.uiStakeDataProvider,
      context.provider
    );
  }

  public async unStakeandWithdraw(tokenId: number): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.unstakeAndWithdraw(tokenId);
  }

  public async getRewardRate(): Promise<BigNumber> {
    return await this._contract.rewardRate();
  }

  public async getBalanceOf(user: string): Promise<BigNumber> {
    return await this._contract.balanceOf(user);
  }

  public async getTotalSupply(): Promise<BigNumber> {
    return await this._contract.totalSupply();
  }

  public async getEarnedValue(user: string): Promise<BigNumber> {
    return await this._contract.earned(user);
  }

  public async getRewardETH(): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.getRewardETH();
  }

  public async getStakedSupply(user: string): Promise<BigNumber> {
    const balanceOf = await this.getBalanceOf(user);
    const totalSupply = await this.getTotalSupply();

    return balanceOf.mul(1e8).div(totalSupply);
  }
}
