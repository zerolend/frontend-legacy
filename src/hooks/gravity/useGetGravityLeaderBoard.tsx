import { useCallback, useEffect, useState } from 'react';
import { getLeaderBoard } from '../../utils/ServerApi';
import { IApi } from '../../utils/interface';
import { IApi_LOADING, IApi_NON_LOADING } from '../../utils/constants';

export interface ILeaderBoard {
  address: string;
  totalSupplyPoints: number;
  totalBorrowPoints: number;
  totalPoints: number;
  stakeBoost: number;
}

export interface IGravityLeaderBoard extends IApi {
  value: ILeaderBoard[];
}

export const NonLoadingGravityLeaderBoard: IGravityLeaderBoard = {
  ...IApi_NON_LOADING,
  value: [],
};
export const LoadingGravityLeaderBoard: IGravityLeaderBoard = {
  ...IApi_LOADING,
  value: [],
};

const useGetGravityLeaderBoard = () => {
  const [data, setData] = useState<IGravityLeaderBoard>(LoadingGravityLeaderBoard);

  const fetchZeroPoints = useCallback(async () => {
    try {
      getLeaderBoard()
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
            setData(NonLoadingGravityLeaderBoard);
          }
        })
        .catch((e) => {
          setData(NonLoadingGravityLeaderBoard);
          console.log('useGetGravityLeaderBoard error', e);
        });
    } catch {
      setData(NonLoadingGravityLeaderBoard);
    }
  }, []);

  useEffect(() => {
    setData(LoadingGravityLeaderBoard);
    fetchZeroPoints().catch((err) => {
      setData(NonLoadingGravityLeaderBoard);
      console.error(`Failed to fetch useGetGravityLeaderBoard Values: ${err.stack}`);
    });
  }, [fetchZeroPoints]);

  return data;
};

export default useGetGravityLeaderBoard;
