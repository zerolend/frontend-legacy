import { useCallback, useEffect, useState } from 'react';
import { useWeb3Context } from '../libs/hooks/useWeb3Context';

interface UserPointsState {
  isLoading: boolean;
  value: string;
}

export const NON_LOADING_UserPoints: UserPointsState = {
  isLoading: false,
  value: '',
};
export const LOADING_UserPoints: UserPointsState = {
  isLoading: true,
  value: '',
};

const useGetUserLineaPoints = () => {
  const [data, setData] = useState<UserPointsState>(LOADING_UserPoints);
  const { currentAccount: walletAddress } = useWeb3Context();

  const fetchUserLXP = useCallback(async () => {
    if (walletAddress !== '') {
      const url = `https://kx58j6x5me.execute-api.us-east-1.amazonaws.com/linea/getUserPointsSearch?user=${walletAddress}`;

      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          if (res) {
            setData({ isLoading: false, value: res[0].xp });
          } else {
            setData(NON_LOADING_UserPoints);
          }
        })
        .catch((e) => {
          setData(NON_LOADING_UserPoints);
          console.log('useGetUserPoints error', e);
        });
    } else {
      setData(NON_LOADING_UserPoints);
    }
  }, [walletAddress]);

  useEffect(() => {
    setData(LOADING_UserPoints);
    fetchUserLXP().catch((err) => {
      setData({ isLoading: false, value: data.value });
      console.error(`Failed to fetch User points Values: ${err.stack}`);
    });
  }, [fetchUserLXP]);

  return data;
};

export default useGetUserLineaPoints;
