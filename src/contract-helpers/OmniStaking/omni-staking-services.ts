import { UiStakeDataProviderContext } from '@aave/contract-helpers/src/uiStakeDataProvider-contract';
import { BigNumber, Contract, PopulatedTransaction } from 'ethers';
import { OmniStakingProviderFactory } from './OmniStakingProviderFactory';

export interface OmniStakingDataProviderInterface {
  unStake: (tokenId: number) => Promise<PopulatedTransaction>;

  unStakeandWithdraw: (tokenId: number) => Promise<PopulatedTransaction>;

  getEarnedValue: (user: string) => Promise<BigNumber>;

  getReward: () => Promise<PopulatedTransaction>;

  getRewardRate: () => Promise<BigNumber>;

  getTotalSupply: () => Promise<BigNumber>;
}

export class OmniStakingDataProvider implements OmniStakingDataProviderInterface {
  private readonly _contract: Contract;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = OmniStakingProviderFactory.connect(
      context.uiStakeDataProvider,
      context.provider
    );
  }

  public async getRewardRate(): Promise<BigNumber> {
    return await this._contract.rewardRate();
  }

  public async getTotalSupply(): Promise<BigNumber> {
    return await this._contract.totalSupply();
  }

  public async getBalanceOf(user: string): Promise<BigNumber> {
    return await this._contract.balanceOf(user);
  }

  public async unStake(tokenId: number): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.unstakeToken(tokenId);
  }

  public async unStakeandWithdraw(tokenId: number): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.unstakeAndWithdraw(tokenId);
  }

  public async getEarnedValue(user: string): Promise<BigNumber> {
    return await this._contract.earned(user);
  }

  public async getReward(): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.getReward();
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
