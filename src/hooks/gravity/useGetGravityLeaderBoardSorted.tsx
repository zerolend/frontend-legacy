import { useCallback, useEffect, useState } from 'react';
import { getLeaderBoardSorted } from '../../utils/ServerApi';
import { IApi, lbUserData } from '../../utils/interface';
import { IApi_LOADING, IApi_NON_LOADING } from '../../utils/constants';

export interface IGravityLeaderBoardSorted extends IApi {
  value: {
    byTotalPoints: lbUserData[];
    byReferralPoints: lbUserData[];
    bySupplyPoints: lbUserData[];
    byBorrowPoints: lbUserData[];
    byStakeBoost: lbUserData[];
  };
}

export const NonLoadingGravityLeaderBoardSorted: IGravityLeaderBoardSorted = {
  ...IApi_NON_LOADING,
  value: {
    byTotalPoints: [],
    byReferralPoints: [],
    bySupplyPoints: [],
    byBorrowPoints: [],
    byStakeBoost: []
  },
};
export const LoadingGravityLeaderBoardSorted: IGravityLeaderBoardSorted = {
  ...IApi_LOADING,
  value: {
    byTotalPoints: [],
    byReferralPoints: [],
    bySupplyPoints: [],
    byBorrowPoints: [],
    byStakeBoost: []
  },
};

const useGetGravityLeaderBoardSorted = () => {
  const [data, setData] = useState<IGravityLeaderBoardSorted>(LoadingGravityLeaderBoardSorted);

  const fetchZeroPoints = useCallback(async () => {
    try {
      getLeaderBoardSorted()
        .then((res) => {
          if (res.success) {
            if (res.data) {
              setData({
                isLoading: false,
                value: res.data,
                success: res.success,
              });
            }
          } else {
            setData(NonLoadingGravityLeaderBoardSorted);
          }
        })
        .catch((e) => {
          setData(NonLoadingGravityLeaderBoardSorted);
          console.log('useGetGravityLeaderBoard error', e);
        });
    } catch {
      setData(NonLoadingGravityLeaderBoardSorted);
    }
  }, []);

  useEffect(() => {
    setData(LoadingGravityLeaderBoardSorted);
    fetchZeroPoints().catch((err) => {
      setData(NonLoadingGravityLeaderBoardSorted);
      console.error(`Failed to fetch useGetGravityLeaderBoard Values: ${err.stack}`);
    });
  }, [fetchZeroPoints]);

  return data;
};

export default useGetGravityLeaderBoardSorted;
