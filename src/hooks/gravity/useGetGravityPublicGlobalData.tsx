import { useCallback, useEffect, useState } from 'react';
import { getGlobalPublicData } from '../../utils/ServerApi';
import { getGlobalPublicDataResponse, IApi } from '../../utils/interface';
import { IApi_LOADING, IApi_NON_LOADING } from '../../utils/constants';

export interface IGravityPublicGlobalData extends IApi {
  value: {
    totalPoints: number;
    totalUsers: number;
  };
}

export const NonLoadingGravityPublicGlobalData: IGravityPublicGlobalData = {
  ...IApi_NON_LOADING,
  value: {
    totalPoints: 0,
    totalUsers: 0,
  },
};
export const LoadingGravityPublicGlobalData: IGravityPublicGlobalData = {
  ...IApi_LOADING,
  value: {
    totalPoints: 0,
    totalUsers: 0,
  },
};

const useGetGravityPublicGlobalData = () => {
  const [data, setData] = useState<IGravityPublicGlobalData>(LoadingGravityPublicGlobalData);

  const fetchZeroPoints = useCallback(async () => {
    try {
      getGlobalPublicData()
        .then((res: getGlobalPublicDataResponse) => {
          if (res.success) {
            if (res.data) {
              setData({
                isLoading: false,
                value: {
                  totalPoints: res.data.totalPoints,
                  totalUsers: res.data.totalUsers,
                },
                success: res.success,
              });
            }
          } else {
            setData(NonLoadingGravityPublicGlobalData);
          }
        })
        .catch((e) => {
          setData(NonLoadingGravityPublicGlobalData);
          console.log('useGetGravityPublicGlobalData error', e);
        });
    } catch {
      setData(NonLoadingGravityPublicGlobalData);
    }
  }, []);

  useEffect(() => {
    setData(LoadingGravityPublicGlobalData);
    fetchZeroPoints().catch((err) => {
      setData(NonLoadingGravityPublicGlobalData);
      console.error(`Failed to fetch useGetGravityPublicGlobalData Values: ${err.stack}`);
    });
  }, [fetchZeroPoints]);

  return data;
};

export default useGetGravityPublicGlobalData;
