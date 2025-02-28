import { useCallback, useEffect, useState } from 'react';

export interface IPoints {
  totalBlastPoints: number;
  totalBlastGoldPoints: number;
  totalEigenLayerPoints_1: number;
  totalXPLineaPoints: number;
  totalRenzoPoints_1: number; //Renzo on ETH
  eigenRenzoPoints_1: number;
  totalKelpMilesPoints_1: number; // Kelp on ETH
  eigenKelpMilesPoints_1: number;
  totalPufferFiPoints_1: number; // Puffer on ETH
  eigenPufferPoints_1: number;
  totalEtherFiPoints_1: number; // Etherfi on ETH
  eigenEtherFiPoints_1: number;
}

export interface IProtocolPoints {
  isLoading: boolean;
  value: IPoints;
}

export const ProtocolBlastPoints: IPoints = {
  totalBlastPoints: 0,
  totalBlastGoldPoints: 0,
  totalEigenLayerPoints_1: 0,
  totalXPLineaPoints: 0,
  totalRenzoPoints_1: 0, //Renzo on ETH
  eigenRenzoPoints_1: 0,
  totalKelpMilesPoints_1: 0, // Kelp on ETH
  eigenKelpMilesPoints_1: 0,
  totalPufferFiPoints_1: 0, // Puffer on ETH
  eigenPufferPoints_1: 0,
  totalEtherFiPoints_1: 0, // Etherfi on ETH
  eigenEtherFiPoints_1: 0,
};

const useGetProtocolPoints = () => {
  const [data, setData] = useState<IProtocolPoints>({
    isLoading: true,
    value: ProtocolBlastPoints,
  });

  const fetchMarketsPoints = useCallback(async () => {
    const url = 'https://api.zerolend.xyz/protocol/points';
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
        if (res) {
          points['totalBlastPoints'] = res['blastPoints'] || 0;
          points['totalBlastGoldPoints'] = res['blastGold'] || 0;
          points['totalEigenLayerPoints_1'] = res['elPoints'] || 0;
          points['totalRenzoPoints_1'] = res['renzoPoints'] || 0; //Renzo on ETH
          points['eigenRenzoPoints_1'] = res['renzoELPoints'] || 0;
          points['totalKelpMilesPoints_1'] = res['kelpMiles'] || 0; // Kelp on ETH
          points['eigenKelpMilesPoints_1'] = res['kelpELPoints'] || 0;
          points['totalPufferFiPoints_1'] = res['pufferFiPoints_1'] || 0; //Puffer on ETH
          points['eigenPufferPoints_1'] = res['pufferFiEigenLayerPoints_1'] || 0;
          points['totalEtherFiPoints_1'] = res['etherFiPoints_1'] || 0; //Etherfi on ETH
          points['eigenEtherFiPoints_1'] = res['etherFiEigenLayerPoints_1'] || 0;
        }
        setData({ isLoading: false, value: { ...points } });
      })
      .catch((e) => {
        console.log('useGetProtocolPoints error', e);
      });
  }, []);

  useEffect(() => {
    setData({ isLoading: true, value: ProtocolBlastPoints });
    fetchMarketsPoints().catch((err) => {
      setData({ isLoading: false, value: data.value });
      console.error(`Failed to fetch useGetProtocolPoints fetchMarketsPoints Values: ${err.stack}`);
    });
  }, [fetchMarketsPoints]);

  return data;
};

export default useGetProtocolPoints;
