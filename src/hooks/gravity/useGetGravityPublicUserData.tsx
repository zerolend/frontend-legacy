import { useCallback, useEffect, useState } from 'react';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';
import { getWalletAddressPublicData } from '../../utils/ServerApi';
import { IApi } from '../../utils/interface';
import { IApi_LOADING, IApi_NON_LOADING } from '../../utils/constants';

export interface IGravityPublicUserData extends IApi {
  value: {
    address: string;
    rank: number;
    referralPoints: number;
    totalPoints: number;
    totalSupplyPoints: number;
    totalBorrowPoints: number;
    stakeZeroPoints: number;
    totalStakePoints: number;
    referralCode: string[];
    referrerCode?: string;
    stakeBoost: number;
  };
}

export const NonLoadingGravityPublicUserData: IGravityPublicUserData = {
  ...IApi_NON_LOADING,
  value: {
    address: '',
    rank: 0,
    referralPoints: 0,
    totalPoints: 0,
    totalSupplyPoints: 0,
    totalBorrowPoints: 0,
    stakeZeroPoints: 0,
    totalStakePoints: 0,
    referralCode: [],
    stakeBoost: 1,
  },
};
export const LoadingGravityPublicUserData: IGravityPublicUserData = {
  ...IApi_LOADING,
  value: {
    address: '',
    rank: 0,
    referralPoints: 0,
    totalPoints: 0,
    totalSupplyPoints: 0,
    totalBorrowPoints: 0,
    stakeZeroPoints: 0,
    totalStakePoints: 0,
    referralCode: [],
    stakeBoost: 0,
  },
};

const useGetGravityPublicUserData = () => {
  const [data, setData] = useState<IGravityPublicUserData>(LoadingGravityPublicUserData);
  const { currentAccount: walletAddress } = useWeb3Context();

  const fetchZeroPoints = useCallback(async () => {
    if (walletAddress !== '') {
      try {
        getWalletAddressPublicData(`address=${walletAddress}`)
          .then((res) => {
            if (res.success) {
              if (res.data) {
                setData({
                  isLoading: false,
                  value: {
                    address: walletAddress,
                    ...res.data.userData,
                  },
                  success: res.success,
                });
              }
            } else {
              setData({ ...NonLoadingGravityPublicUserData, error: res.data?.error });
            }
          })
          .catch((e) => {
            setData(NonLoadingGravityPublicUserData);
            console.log('useGetGravityPublicUserData error', e);
          });
      } catch (e) {
        setData(NonLoadingGravityPublicUserData);
      }
    } else {
      setData(NonLoadingGravityPublicUserData);
    }
  }, [walletAddress]);

  useEffect(() => {
    setData(LoadingGravityPublicUserData);
    fetchZeroPoints().catch((err) => {
      setData(NonLoadingGravityPublicUserData);
      console.error(`Failed to fetch useGetGravityPublicUserData Values: ${err.stack}`);
    });
  }, [fetchZeroPoints]);

  return data;
};

export default useGetGravityPublicUserData;
