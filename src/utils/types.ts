import BigNumber from 'bignumber.js';
import { VestCategory } from 'src/contract-helpers/types';

export interface Hashable {
  toHash: () => string;
}

export interface IVestMint {
  who: string;
  pending: BigNumber;
  upfront: BigNumber;
  linearDuration: BigNumber;
  cliffDuration: BigNumber;
  unlockDate: string;
  hasPenalty: boolean;
  category: VestCategory;
}
