export interface IApi {
  isLoading: boolean;
  error?: string;
  success: boolean;
}

export type ITxStatus =
  | 'initial'
  | 'not-initiated'
  | 'in-progress'
  | 'successful'
  | 'not-successful'
  | '';

export interface lbUserData {
  address: string;
  referralPoints: number;
  totalSupplyPoints: number;
  totalBorrowPoints: number;
  totalPoints: number;
  rank: number;
  stakeBoost: number;
}

export interface getGlobalPublicDataResponse extends IApi {
  data: {
    totalPoints: number;
    totalUsers: number;
  };
}

export interface getLineaXPReferralPointsResponse extends IApi {
  success: boolean;
  xp: string;
}

export interface getGravityLeaderBoardResponse extends IApi {
  data: [
    {
      address: string;
      totalSupplyPoints: number;
      totalBorrowPoints: number;
      totalPoints: number;
      totalStakePoints: number;
      stakeBoost: number;
    }
  ];
}

export interface getGravitySeasonResponse extends IApi {
  data: {
    season: "jul-2024" | "jan-2025";
  }
}

export interface getGravityLeaderBoardSortedResponse extends IApi {
  data: {
    byTotalPoints: lbUserData[];
    byReferralPoints: lbUserData[];
    bySupplyPoints: lbUserData[];
    byBorrowPoints: lbUserData[];
    byStakeBoost: lbUserData[];
  }
}

export interface getGravityUserPublicResponse extends IApi {
  data: {
    userData: {
      rank: number;
      referralPoints: number;
      totalPoints: number;
      totalSupplyPoints: number;
      totalBorrowPoints: number;
      stakeZeroPoints: number;
      stakeBoost: number;
      totalStakePoints: number;
      referralCode: string[];
      referrerCode?: string;
    };
    error?: string;
  };
}

export interface linkReferralCodeBody {
  walletAddress: string;
  message: string;
  signHash: string;
  referralCode: string;
}

export interface getWalletAddressCurrentPointsDataResponse extends IApi {
  data: {
    totalCurrentSupplyPointsPerSec: number,
    totalCurrentBorrowPointsPerSec: number,
    totalCurrentStakingPointsPerSec: number,
    totalCurrentPointsPerSec: number,
    totalCurrentSupplyPoints: number,
    totalCurrentBorrowPoints: number,
    totalCurrentStakingPoints: number,
    totalCurrentPoints: number
  };
}
