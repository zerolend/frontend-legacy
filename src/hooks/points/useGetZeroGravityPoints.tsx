import { useCallback, useEffect, useState } from 'react';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';

export interface IPoints {
  isLoading: boolean;
  value: number;
}

export const NonLoadingGravityPoints: IPoints = {
  isLoading: false,
  value: 0,
};
export const LoadingGravityPoints: IPoints = {
  isLoading: true,
  value: 0,
};

const useGetZeroGravityPoints = () => {
  const [data, setData] = useState<IPoints>(LoadingGravityPoints);
  const { currentAccount: walletAddress } = useWeb3Context();

  const fetchZeroPoints = useCallback(async () => {
    if (walletAddress !== '') {
      const url = `https://airdrop-api-aws.zerolend.xyz/user/userTotalPoints?walletAddress=${walletAddress}`;
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers':
          'access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type',
      };

      fetch(url, { headers, method: 'GET' })
        .then((res) => res.json())
        .then((res) => {
          setData({ isLoading: false, value: res['totalPoints'] || 0 });
        })
        .catch((e) => {
          setData(NonLoadingGravityPoints);
          console.log('useGetZeroGravityPoints error', e);
        });
    } else {
      setData(NonLoadingGravityPoints);
    }
  }, [walletAddress]);

  useEffect(() => {
    setData(LoadingGravityPoints);
    fetchZeroPoints().catch((err) => {
      setData({ isLoading: false, value: data.value });
      console.error(`Failed to fetch fetchZeroPoints Values: ${err.stack}`);
    });
  }, [fetchZeroPoints]);

  return data;
};

export default useGetZeroGravityPoints;
