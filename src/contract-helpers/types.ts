import { BigNumber } from 'ethers';

export type GetUserVestingData = {
  id: number;
  cliffDuration: number;
  unlockDate: number;
  pendingClaimed: number;
  pending: number;
  upfrontClaimed: number;
  upfront: number;
  linearDuration: number;
  createdAt: number;
  hasPenalty: boolean;
  category: VestCategory;
  claimable: BigNumber;
  unClaimed: BigNumber;
  penalty: BigNumber;
};

export type GetUserLockData = {
  id: number;
  amount: BigNumber;
  end: BigNumber;
  start: BigNumber;
  power: BigNumber;
  apr: BigNumber;
  type: 'nft' | 'lock';
};

export type GetClaimable = {
  pending: BigNumber;
  upfront: BigNumber;
};

export enum VestCategory {
  INVESTOR,
  EARLY_ZERO,
  NORMAL,
  AIRDROP,
}
