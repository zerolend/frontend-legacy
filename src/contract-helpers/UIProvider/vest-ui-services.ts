import { UiStakeDataProviderContext } from '@aave/contract-helpers/src/uiStakeDataProvider-contract';
import { Contract } from 'ethers';
import { VestUIProviderFactory } from './VestUIProviderFactory';
import { GetUserLockData, GetUserVestingData } from '../types';

export interface VestUIDataProviderInterface {
  getUserVestingData: (user: string) => Promise<GetUserVestingData[]>;

  getUserLockData: (user: string) => Promise<GetUserLockData[]>;
}

export class VestUIDataProvider implements VestUIDataProviderInterface {
  private readonly _contract: Contract;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = VestUIProviderFactory.connect(context.uiStakeDataProvider, context.provider);
  }

  public async getUserVestingData(user: string): Promise<GetUserVestingData[]> {
    return await this._contract.getVestedNFTData(user);
  }

  public async getUserLockData(user: string): Promise<GetUserLockData[]> {
    return await this._contract.getLockDetails(user);
  }

  public async getUserLPLockData(user: string): Promise<GetUserLockData[]> {
    return await this._contract.getLPLockDetails(user);
  }
}
