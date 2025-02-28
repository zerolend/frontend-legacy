import { useCallback, useEffect, useState } from 'react';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';

export interface IPoints {
  totalBlastPoints: number;
  totalBlastGoldPoints: number;
}

export interface IProtocolDistributedUserPoints {
  isLoading: boolean;
  value: IPoints;
}

export const ProtocolBlastPoints: IPoints = {
  totalBlastPoints: 0,
  totalBlastGoldPoints: 0,
};

const useGetDistributedUsersPoints = () => {
  const [data, setData] = useState<IProtocolDistributedUserPoints>({
    isLoading: true,
    value: ProtocolBlastPoints,
  });
  const { currentAccount: walletAddress } = useWeb3Context();

  const fetchMarketsPoints = useCallback(async () => {
    if (walletAddress !== '') {
      const url = `https://airdrop-api-aws.zerolend.xyz/blast?walletAddress=${walletAddress}`;
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers':
          'access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type',
      };

      fetch(url, { headers })
        .then((res) => res.json())
        .then((res) => {
          const points = ProtocolBlastPoints;
          if (res?.response) {
            points['totalBlastPoints'] = res?.response['blastPoint'] || 0;
            points['totalBlastGoldPoints'] = res?.response['blastGold'] || 0;
          }
          setData({ isLoading: false, value: { ...points } });
        })
        .catch((e) => {
          console.log('useGetDistributedUsersPoints error', e);
        });
    }
  }, [walletAddress]);

  useEffect(() => {
    setData({ isLoading: true, value: ProtocolBlastPoints });
    fetchMarketsPoints().catch((err) => {
      setData({ isLoading: false, value: data.value });
      console.error(
        `Failed to fetch useGetDistributedUsersPoints fetchMarketsPoints Values: ${err.stack}`
      );
    });
  }, [fetchMarketsPoints]);

  return data;
};

export default useGetDistributedUsersPoints;
