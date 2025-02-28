import { UiStakeDataProviderContext } from '@aave/contract-helpers/src/uiStakeDataProvider-contract';
import { BigNumber, Contract, PopulatedTransaction } from 'ethers';
import { GetClaimable, GetUserVestingData } from '../types';
import { VestingProviderFactory } from './VestingProviderFactory';
import { ERC20Service, IERC20ServiceInterface } from '@aave/contract-helpers';

export interface VestingDataProviderInterface {
  getUserVestingData: (params: { user: string }) => Promise<GetUserVestingData[]>;

  getUserNFTBalance: (user: string) => Promise<BigNumber>;

  getUserVestClaimable: (user: string) => Promise<BigNumber>;

  getUserVestUnClaimed: (tokenId: string) => Promise<BigNumber>;

  getUserVestPenalty: (tokenId: string) => Promise<BigNumber>;

  setClaimSingleReward: (tokenId: number) => Promise<PopulatedTransaction>;

  setStakeNFT: (
    from: string,
    to: string,
    nftId: number,
    data: string
  ) => Promise<PopulatedTransaction>;

  setTransferNFT: (from: string, to: string, nftId: number) => Promise<PopulatedTransaction>;
}

export class VestingDataProvider implements VestingDataProviderInterface {
  private readonly _contract: Contract;

  readonly erc20Service: IERC20ServiceInterface;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = VestingProviderFactory.connect(context.uiStakeDataProvider, context.provider);

    this.erc20Service = new ERC20Service(context.provider);
  }

  public async getUserNFTBalance(user: string): Promise<BigNumber> {
    return await this._contract.balanceOf(user);
  }

  public async getUserVestClaimable(tokenId: string): Promise<BigNumber> {
    const claimable: GetClaimable = await this._contract['claimable(uint256)'](tokenId);

    return claimable.pending.add(claimable.upfront);
  }

  public async getUserVestUnClaimed(tokenId: string): Promise<BigNumber> {
    return await this._contract.unclaimed(tokenId);
  }

  public async getUserVestPenalty(tokenId: string): Promise<BigNumber> {
    return await this._contract.penalty(tokenId);
  }

  public async getUserVestingData({ user }: { user: string }): Promise<GetUserVestingData[]> {
    const userDataArray: GetUserVestingData[] = [];
    const userBalance: BigNumber = await this.getUserNFTBalance(user);

    for (let i = 0; i < userBalance.toNumber(); i++) {
      const tokenId = await this._contract.tokenOfOwnerByIndex(user, i);

      const tokenData = await this._contract.tokenIdToLockDetails(tokenId);

      const claimable = await this.getUserVestClaimable(tokenId);

      const unClaimed = await this.getUserVestUnClaimed(tokenId);

      const penaltyValue = await this.getUserVestPenalty(tokenId);

      userDataArray.push({
        id: tokenId,
        cliffDuration:
          tokenData.category === 3 ? tokenData.linearDuration : tokenData.cliffDuration,
        unlockDate: tokenData.unlockDate,
        pending: tokenData.pending,
        pendingClaimed: tokenData.pendingClaimed,
        upfront: tokenData.upfront,
        upfrontClaimed: tokenData.upfrontClaimed,
        linearDuration: tokenData.linearDuration,
        createdAt: tokenData.createdAt,
        hasPenalty: tokenData.hasPenalty,
        category: tokenData.category,
        claimable: claimable.sub(tokenData.pendingClaimed.add(tokenData.upfrontClaimed)),
        unClaimed: unClaimed,
        penalty: penaltyValue,
      });
    }

    return userDataArray;
  }

  public async setClaimSingleReward(tokenId: number): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction['claim(uint256)'](tokenId);
  }

  public async setClaimAllRewards(tokenIds: number[]): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction['claim(uint256[])'](tokenIds);
  }

  public async setStakeNFT(
    from: string,
    to: string,
    nftId: number,
    data: string
  ): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction[
      'safeTransferFrom(address,address,uint256,bytes)'
    ](from, to, nftId, data);
  }

  public async setTransferNFT(
    from: string,
    to: string,
    nftId: number
  ): Promise<PopulatedTransaction> {
    return await this._contract.populateTransaction['safeTransferFrom(address,address,uint256)'](
      from,
      to,
      nftId
    );
  }
}
