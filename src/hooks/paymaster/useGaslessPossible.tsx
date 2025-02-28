import { useCallback, useEffect, useState } from 'react';
import { useRootStore } from 'src/store/root';

interface IGasless {
  isLoading: boolean;
  isGaslessPossible: boolean;
}

let responseClone: any; // 1

const useGaslessPossible = () => {
  const [data, setData] = useState<IGasless>({ isLoading: false, isGaslessPossible: false });
  const [currentMarketData] = useRootStore((state) => [state.currentMarketData]);

  const fetchApr = useCallback(async () => {
    fetch('https://paymaster.zyfi.org/api/v1/address', {
      method: 'GET',
      headers: {
        accept: 'text',
      },
    })
      .then((response) => {
        responseClone = response.clone(); // 2
        return response.json();
      })
      .then(
        () => {
          setData({ isLoading: false, isGaslessPossible: true });
        },
        function () {
          responseClone
            .text() // 5
            .then(function () {
              setData({ isLoading: false, isGaslessPossible: true });
            });
        }
      )
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setData({ isLoading: true, isGaslessPossible: false });
    fetchApr().catch((err) => {
      setData({ isLoading: false, isGaslessPossible: false });
      console.error(`Failed to fetch gasless: ${err.stack}`);
    });
  }, [fetchApr, currentMarketData.addresses.PAYMASTER]);

  return data;
};

export default useGaslessPossible;
