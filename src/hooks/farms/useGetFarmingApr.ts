import { useCallback, useEffect, useState } from 'react';
import { TypeFarmConfig } from '../../ui-config/farmConfig';

export interface ICollateralApr {
  isLoading: boolean;
  value: number;
}

type KNCRes = {
  address: string;
  apr: number;
};

const useGetFarmingApr = (farm: TypeFarmConfig) => {
  const [data, setData] = useState<ICollateralApr>({ isLoading: true, value: 0 });

  const retrieveVeSyncApr = (res: any) => {
    const response: KNCRes[] = res;
    const searchedFarm: KNCRes[] = response.filter((data) => data.address === farm.apiSearchKey);
    if (searchedFarm.length > 0) {
      setData({
        isLoading: false,
        value: searchedFarm[0].apr > 0 ? searchedFarm[0].apr / 100 : 0,
      });
    }
  };

  const retrieveVelocoreApr = () => {
    setData({
      isLoading: false,
      value: 0.2,
    });
  };

  const retrieveSpaceFiApr = () => {
    setData({
      isLoading: false,
      value: 2.0787,
    });
  };

  const retrieveSwordApr = () => {
    setData({
      isLoading: false,
      value: 14.7941,
    });
  };

  const fetchApr = useCallback(async () => {
    const url = farm.api;
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers':
        'access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type',
    };

    fetch(url, { headers })
      .then((res) => res.json())
      .then((res) => {
        if (farm.platform === 'VeSync') retrieveVeSyncApr(res);
      })
      .catch(() => {
        if (farm.platform === 'Velocore') retrieveVelocoreApr();
        else if (farm.platform === 'SpaceFi') retrieveSpaceFiApr();
        else if (farm.platform === 'Sword') retrieveSwordApr();
        else setData({ isLoading: false, value: 0 });
      });
  }, []);

  useEffect(() => {
    setData({ isLoading: true, value: 0 });
    fetchApr().catch((err) => {
      setData({ isLoading: false, value: 0 });
      console.error(`Failed to fetch extraApr Values: ${err.stack}`);
    });
  }, [fetchApr]);

  return data;
};

export default useGetFarmingApr;
