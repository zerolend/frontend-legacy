import { useCallback, useEffect, useState } from 'react';
import { useWeb3Context } from '../libs/hooks/useWeb3Context';
import { getLineaXPReferralPoints } from '../utils/ServerApi';
import { LOADING_UserPoints, NON_LOADING_UserPoints } from './useGetUserLineaPoints';

interface UserPointsState {
  isLoading: boolean;
  value: string;
}

const useGetReferralLXPPoints = () => {
  const [data, setData] = useState<UserPointsState>(LOADING_UserPoints);
  const { currentAccount: walletAddress } = useWeb3Context();

  const fetchMerkleProof = useCallback(async () => {
    if (walletAddress !== '') {
      getLineaXPReferralPoints()
        .then((res) => {
          if (res.success) {
            if (res) {
              setData({
                isLoading: false,
                value: res.xp,
              });
            }
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
    fetchMerkleProof().catch((err) => {
      setData({ isLoading: false, value: data.value });
      console.error(`Failed to fetch User points Values: ${err.stack}`);
    });
  }, [fetchMerkleProof]);

  return data;
};

export default useGetReferralLXPPoints;
