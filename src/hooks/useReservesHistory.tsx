/**
 * This hook is used for getting historical reserve data, and it is primarily used with charts.
 * In particular, this hook is used in the ApyGraph.
 */
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { ESupportedTimeRanges } from 'src/modules/reserve-overview/TimeRangeSelector';
import { makeCancelable } from 'src/utils/utils';
import { MARKET_IDS } from '../ui-config/marketsConfig';

export const reserveRateTimeRangeOptions = [
  ESupportedTimeRanges.OneMonth,
  ESupportedTimeRanges.SixMonths,
  ESupportedTimeRanges.OneYear,
];
export type ReserveRateTimeRange = typeof reserveRateTimeRangeOptions[number];

type RatesHistoryParams = {
  from: number;
  resolutionInHours: number;
};

type APIResponse = {
  liquidityRate_avg: number;
  variableBorrowRate_avg: number;
  stableBorrowRate_avg: number;
  utilizationRate_avg: number;
  x: { year: number; month: number; date: number; hours: number };
};

const fetchStats = async (market: string, symbol: string, timeRange: ReserveRateTimeRange) => {
  const { from } = resolutionForTimeRange(timeRange);
  try {
    const url = `https://api.zerolend.xyz/historicalRates?market=${market}&symbol=${symbol}&from=${from}`;
    const result = await fetch(url);
    return await result.json();
  } catch (e) {
    return [];
  }
};

// TODO: there is possibly a bug here, as Polygon and Avalanche v2 data is coming through empty and erroring in our hook
// The same asset without the 'from' field comes through just fine.
const resolutionForTimeRange = (timeRange: ReserveRateTimeRange): RatesHistoryParams => {
  // Return today as a fallback
  let calculatedDate = dayjs().unix();
  switch (timeRange) {
    case ESupportedTimeRanges.OneMonth:
      calculatedDate = dayjs().subtract(30, 'day').unix();
      return {
        from: calculatedDate,
        resolutionInHours: 6,
      };
    case ESupportedTimeRanges.SixMonths:
      calculatedDate = dayjs().subtract(6, 'month').unix();
      return {
        from: calculatedDate,
        resolutionInHours: 24,
      };
    case ESupportedTimeRanges.OneYear:
      calculatedDate = dayjs().subtract(1, 'year').unix();
      return {
        from: calculatedDate,
        resolutionInHours: 24,
      };
    default:
      return {
        from: calculatedDate,
        resolutionInHours: 6,
      };
  }
};

export type FormattedReserveHistoryItem = {
  date: number;
  liquidityRate: number;
  utilizationRate: number;
  stableBorrowRate: number;
  variableBorrowRate: number;
};

/**
 * Broken Assets:
 * A list of assets that currently are broken in some way, i.e. has bad data from either the subgraph or backend server
 * Each item represents the ID of the asset, not the underlying address it's deployed to, appended with LendingPoolAddressProvider
 * contract address it is held in. So each item in the array is essentially [underlyingAssetId + LendingPoolAddressProvider address].
 */
export const BROKEN_ASSETS = [
  // ampl https://governance.aave.com/t/arc-fix-ui-bugs-in-reserve-overview-for-ampl/5885/5?u=sakulstra
  '0xd46ba6d942050d489dbd938a2c909a5d5039a1610xb53c1a33016b2dc2ff3653530bff1848a515c8c5',
  // fei usd (v2 eth mainnet)
  '0x956f47f50a910163d8bf957cf5846d573e7f87ca0xb53c1a33016b2dc2ff3653530bff1848a515c8c5',
];

// TODO: api need to be altered to expect chainId underlying asset and poolConfig
export function useReserveRatesHistory(
  reserveAddress: string,
  timeRange: ReserveRateTimeRange,
  symbol: string
) {
  const { currentNetworkConfig, currentMarket } = useProtocolDataContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<FormattedReserveHistoryItem[]>([]);

  const ratesHistoryApiUrl = currentNetworkConfig?.ratesHistoryApiUrl;

  const refetchData = useCallback<() => () => void>(() => {
    // reset
    setLoading(true);
    setError(false);
    setData([]);

    if (reserveAddress && !BROKEN_ASSETS.includes(reserveAddress)) {
      const cancelable = makeCancelable(fetchStats(MARKET_IDS[currentMarket], symbol, timeRange));

      cancelable.promise
        .then((response) => {
          if (response.success === true) {
            setData(
              response.data.processedData.map((d: APIResponse) => {
                return {
                  date: dayjs()
                    .year(d.x.year)
                    .month(d.x.month - 1)
                    .date(d.x.date)
                    .hour(d.x.hours)
                    .minute(0)
                    .second(0)
                    .unix(),
                  liquidityRate: d.liquidityRate_avg,
                  variableBorrowRate: d.variableBorrowRate_avg,
                  utilizationRate: d.utilizationRate_avg,
                  stableBorrowRate: d.stableBorrowRate_avg,
                };
              })
            );
          }
          setLoading(false);
        })
        .catch((e) => {
          console.error('useReservesHistory(): Failed to fetch historical reserve data.', e);
          setError(true);
          setLoading(false);
        });

      return cancelable.cancel;
    }

    setLoading(false);
    return () => null;
  }, [reserveAddress, timeRange, ratesHistoryApiUrl]);

  useEffect(() => {
    const cancel = refetchData();
    return () => cancel();
  }, [refetchData]);

  return {
    loading,
    data,
    error: error || BROKEN_ASSETS.includes(reserveAddress) || (!loading && data.length === 0),
    refetch: refetchData,
  };
}
