import { useCallback, useEffect, useState } from 'react';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';
import { getWalletAddressCurrentPointsData } from '../../utils/ServerApi';
import { IApi } from '../../utils/interface';
import { IApi_LOADING, IApi_NON_LOADING } from '../../utils/constants';

export interface IUsersCurrentPointsData extends IApi {
  value: {
    address: string;
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

export const NonLoadingUsersCurrentPoints: IUsersCurrentPointsData = {
  ...IApi_NON_LOADING,
  value: {
    address: '',
    totalCurrentSupplyPointsPerSec: 0,
    totalCurrentBorrowPointsPerSec: 0,
    totalCurrentStakingPointsPerSec: 0,
    totalCurrentPointsPerSec: 0,
    totalCurrentSupplyPoints: 0,
    totalCurrentBorrowPoints: 0,
    totalCurrentStakingPoints: 0,
    totalCurrentPoints: 0,
  },
};
export const LoadingUsersCurrentPoints: IUsersCurrentPointsData = {
  ...IApi_LOADING,
  value: {
    address: '',
    totalCurrentSupplyPointsPerSec: 0,
    totalCurrentBorrowPointsPerSec: 0,
    totalCurrentStakingPointsPerSec: 0,
    totalCurrentPointsPerSec: 0,
    totalCurrentSupplyPoints: 0,
    totalCurrentBorrowPoints: 0,
    totalCurrentStakingPoints: 0,
    totalCurrentPoints: 0,
  },
};

const useGetUsersCurrentPointsData = () => {
  const [data, setData] = useState<IUsersCurrentPointsData>(LoadingUsersCurrentPoints);
  const { currentAccount: walletAddress } = useWeb3Context();

  const fetchZeroPoints = useCallback(async () => {
    if (walletAddress !== '') {
      try {
        getWalletAddressCurrentPointsData(`address=${walletAddress}`)
          .then((res) => {
            if (res.success) {
              if (res?.data) {
                setData({
                  isLoading: false,
                  value: {
                    address: walletAddress,
                    ...res.data,
                  },
                  success: res.success,
                });
              }
            } else {
              setData(NonLoadingUsersCurrentPoints);
            }
          })
          .catch((e) => {
            setData(NonLoadingUsersCurrentPoints);
            console.log('useGetGravityPublicUserData error', e);
          });
      } catch (e) {
        setData(NonLoadingUsersCurrentPoints);
      }
    } else {
      setData(NonLoadingUsersCurrentPoints);
    }
  }, [walletAddress]);

  useEffect(() => {
    setData(LoadingUsersCurrentPoints);
    fetchZeroPoints().catch((err) => {
      setData(NonLoadingUsersCurrentPoints);
      console.error(`Failed to fetch useGetGravityPublicUserData Values: ${err.stack}`);
    });
  }, [fetchZeroPoints]);

  return data;
};

export default useGetUsersCurrentPointsData;
