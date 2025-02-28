import apiCaller from './apiCaller';
import {
  getGlobalPublicDataResponse,
  getGravityLeaderBoardResponse,
  getGravityLeaderBoardSortedResponse, getGravitySeasonResponse,
  getGravityUserPublicResponse,
  getLineaXPReferralPointsResponse,
  getWalletAddressCurrentPointsDataResponse,
  linkReferralCodeBody,
} from './interface';

export const checkServer = async (): Promise<any> => {
  return await apiCaller(``, 'get');
};

export const getImpliedAprs = async (): Promise<{ [key: number]: { [key: string]: string } }> => {
  return await apiCaller(
    ``,
    'get',
    null,
    undefined,
    undefined,
    'https://api.zerolend.xyz/pendle/impliedApy'
  );
};

export const getLeaderBoard = async (): Promise<getGravityLeaderBoardResponse> => {
  return await apiCaller(`leaderBoard`, 'get', null);
};

export const getCurrentSeason = async (): Promise<getGravitySeasonResponse> => {
  return await apiCaller(`currentSeason`, 'get', null);
};

export const getLeaderBoardSorted = async (): Promise<getGravityLeaderBoardSortedResponse> => {
  return await apiCaller(`leaderBoardwithSortKeys`, 'get', null);
};

export const getWalletAddressPublicData = async (
  queryParams: string
): Promise<getGravityUserPublicResponse> => {
  return await apiCaller(`user/userInfo`, 'get', null, queryParams);
};

export const getWalletAddressCurrentPointsData = async (
  queryParams: string
): Promise<getWalletAddressCurrentPointsDataResponse> => {
  return await apiCaller(`user/userCurrentPoints`, 'get', null, queryParams);
};

export const getGlobalPublicData = async (): Promise<getGlobalPublicDataResponse> => {
  return await apiCaller(`globalData`, 'get', null);
};

export const getLineaXPReferralPoints = async (): Promise<getLineaXPReferralPointsResponse> => {
  return await apiCaller(`referral/openBlock`, 'get', null);
};

export const linkReferralCode = async (
  data: linkReferralCodeBody
): Promise<{
  data: { error?: string; msg?: string };
  success: boolean;
}> => {
  return await apiCaller(`linkReferral`, 'patch', data);
};

export const getMerklAPR = async (): Promise<
  {
    apr: number;
    tokens: any[];
    chainId: number;
    rewards: any[];
  }[]
> => {
  const response = await fetch('https://api.merkl.xyz/v4/opportunities/?name=zerolend&items=100');
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();

  const result = data
    .filter((item: any) => item.status === 'LIVE')
    .map((item: any) => {
      return {
        apr: item.apr,
        tokens: item.tokens,
        chainId: item.chainId,
        rewards: item.rewardsRecord.breakdowns,
      };
    });

  return result;
};
