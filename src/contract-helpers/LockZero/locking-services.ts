import { UiStakeDataProviderContext } from '@aave/contract-helpers/src/uiStakeDataProvider-contract';
import { Contract, PopulatedTransaction } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { LockProviderFactory } from './LockProviderFactory';

export interface LockDataProviderInterface {
  getUserLockBalance: (user: string) => Promise<BigNumber>;

  generateNFTAllowance: (nftId: number) => Promise<string>;

  setCreateLock: (
    amount: string,
    duration: number,
    isNFT: boolean
  ) => Promise<PopulatedTransaction>;

  setWithdrawLock: (tokenId: number) => Promise<PopulatedTransaction>;

  setApproveNFT: (to: string, nftId: number) => Promise<PopulatedTransaction>;

  setStakeNFT: (from: string, to: string, nftId: number) => Promise<PopulatedTransaction>;
}

export class LockDataProvider implements LockDataProviderInterface {
  private readonly _contract: Contract;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = LockProviderFactory.connect(context.uiStakeDataProvider, context.provider);
  }

  public async getUserLockBalance(user: string): Promise<BigNumber> {
    return await this._contract.balanceOf(user);
  }

  public async generateNFTAllowance(tokenId: number): Promise<string> {
    return await this._contract.getApproved(tokenId);
  }

  public async setCreateLock(
    amount: string,
    duration: number,
    stakeNFT: boolean
  ): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.createLock(amount, duration, stakeNFT);
  }

  public async setWithdrawLock(tokenId: number): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.withdraw(tokenId);
  }

  public async setApproveNFT(to: string, nftId: number): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction.approve(to, nftId);
  }

  public async setStakeNFT(from: string, to: string, nftId: number): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction['safeTransferFrom(address,address,uint256)'](
      from,
      to,
      nftId
    );
  }
}
