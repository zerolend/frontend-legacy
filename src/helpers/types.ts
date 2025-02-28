import { BigNumber } from 'ethers';
import { VestCategory } from 'src/contract-helpers/types';

export type TxState = {
  txError?: string;
  success: boolean;
  gasEstimationError?: string;
};

export type Reward = {
  assets: string[];
  incentiveControllerAddress: string;
  symbol: string;
  balance: string;
  balanceUsd: string;
  rewardTokenAddress: string;
};

export type IVests = {
  //10000 $ZERO > 25%upfront | 6mos cliff | 6mos linear vesting
  id: number; //1
  cliffDuration: number; //6mos
  unlockDate: number; //after 12mo
  //This handles the actual vesting
  pendingClaimed: number; // amount that is claimed from 7500 after linear vesting starts
  pending: number; //7500

  //this handles the upfront
  upfrontClaimed: number; //2500
  upfront: number; //2500

  linearDuration: number; //6mos
  createdAt: number; //now
  hasPenalty: boolean; //till unlocked date it would be true
  category: VestCategory; //earlyzero, investor, advisors
  claimable: BigNumber; //2500
  // unclaimed?: BigNumber; //upfront + pending - (upfront claimed + pending claimed)
};

//at tge
/*{  //10000 $ZERO > 25%upfront | 6mos cliff | 6mos linear vesting
  //This handles the actual vesting
  pendingClaimed: number; 0
  pending: number; //7500

  //this handles the upfront
  upfrontClaimed: number; //0
  upfront: number; //2500

  claimable: BigNumber; //2500
  unclaimed: BigNumber; //upfront + pending - (upfront claimed + pending claimed) > (2500 + 7500) - (0 + 0) => 10000
};*/

// after 3mon
/*{  //10000 $ZERO > 25%upfront | 6mos cliff | 6mos linear vesting
  //This handles the actual vesting
  pendingClaimed: number; 0
  pending: number; //7500

  //this handles the upfront
  upfrontClaimed: number; //2500
  upfront: number; //2500

  claimable: BigNumber; //0
  unclaimed: BigNumber; //upfront + pending - (upfront claimed + pending claimed) > (2500 + 7500) - (2500 + 0) => 7500
};*/

// after 7thmo
/*{  //10000 $ZERO > 25%upfront | 6mos cliff | 6mos linear vesting > 1250/mo
  //This handles the actual vesting
  pendingClaimed: number; 1250 //claimed one mo of vest
  pending: number; //7500

  //this handles the upfront
  upfrontClaimed: number; //2500
  upfront: number; //2500

  claimable: BigNumber; //1250 // of 7th month
  unclaimed: BigNumber; //upfront + pending - (upfront claimed + pending claimed) > (2500 + 7500) - (2500 + 1250) => 6250
};*/

export type ILocks = {
  id: number;
};

export type EmodeCategory = {
  id: number;
  ltv: number;
  liquidationThreshold: number;
  liquidationBonus: number;
  priceSource: string;
  label: string;
  assets: string[];
};

export enum DelegationType {
  VOTING = '0',
  PROPOSITION_POWER = '1',
  BOTH = '2',
}

export enum CollateralType {
  ENABLED,
  ISOLATED_ENABLED,
  DISABLED,
  ISOLATED_DISABLED,
  UNAVAILABLE,
  UNAVAILABLE_DUE_TO_ISOLATION,
}
