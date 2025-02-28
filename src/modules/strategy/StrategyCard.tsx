import { ListWrapper } from 'src/components/lists/ListWrapper';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import * as React from 'react';
import BigNumber from 'bignumber.js';
import { useRootStore } from '../../store/root';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import {
  ComputedReserveData,
  useAppDataContext,
} from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWalletBalances } from 'src/hooks/app-data-provider/useWalletBalances';
import { USD_DECIMALS, valueToBigNumber } from '@aave/math-utils';
import { API_ETH_MOCK_ADDRESS } from '@aave/contract-helpers';
import { fetchIconSymbolAndName } from 'src/ui-config/reservePatches';
import { DashboardReserve, handleSortDashboardReserves } from 'src/utils/dashboardSortUtils';
import { ROUTES } from 'src/components/primitives/Link';

export interface EZeroMerkleProofDataType {
  address: string;
  totalAmount: string;
  proofs: string[];
}

export type GravityMerkleDataType = {
  data: {
    account: string;
    amount: string;
  };
  proofs: string[];
};

const StrategyCard = () => {
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentNetworkConfig, currentMarket } = useProtocolDataContext();
  const { user, reserves, marketReferencePriceInUsd } = useAppDataContext();
  const { walletBalances } = useWalletBalances();
  const [displayGho] = useRootStore((store) => [store.displayGho]);

  const sortName = '';
  const sortDesc = false;

  const { baseAssetSymbol } = currentNetworkConfig;

  const localStorageName = 'showSupplyZeroAssets';
  const isShowZeroAssets = localStorage.getItem(localStorageName) === 'true';

  const tokensToSupply = reserves
    .filter(
      (reserve: ComputedReserveData) =>
        !(reserve.isFrozen || reserve.isPaused) &&
        !displayGho({ symbol: reserve.symbol, currentMarket })
    )
    .map((reserve: ComputedReserveData) => {
      const walletBalance = walletBalances[reserve.underlyingAsset]?.amount;
      const walletBalanceUSD = walletBalances[reserve.underlyingAsset]?.amountUSD;
      let availableToDeposit = valueToBigNumber(walletBalance);
      if (reserve.supplyCap !== '0') {
        availableToDeposit = BigNumber.min(
          availableToDeposit,
          new BigNumber(reserve.supplyCap).minus(reserve.totalLiquidity).multipliedBy('0.995')
        );
      }
      const availableToDepositUSD = valueToBigNumber(availableToDeposit)
        .multipliedBy(reserve.priceInMarketReferenceCurrency)
        .multipliedBy(marketReferencePriceInUsd)
        .shiftedBy(-USD_DECIMALS)
        .toString();

      const isIsolated = reserve.isIsolated;
      const hasDifferentCollateral = user?.userReservesData.find(
        (userRes) => userRes.usageAsCollateralEnabledOnUser && userRes.reserve.id !== reserve.id
      );

      const usageAsCollateralEnabledOnUser = !user?.isInIsolationMode
        ? reserve.reserveLiquidationThreshold !== '0' &&
          (!isIsolated || (isIsolated && !hasDifferentCollateral))
        : !isIsolated
        ? false
        : !hasDifferentCollateral;

      if (reserve.isWrappedBaseAsset) {
        let baseAvailableToDeposit = valueToBigNumber(
          walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount
        );
        if (reserve.supplyCap !== '0') {
          baseAvailableToDeposit = BigNumber.min(
            baseAvailableToDeposit,
            new BigNumber(reserve.supplyCap).minus(reserve.totalLiquidity).multipliedBy('0.995')
          );
        }
        const baseAvailableToDepositUSD = valueToBigNumber(baseAvailableToDeposit)
          .multipliedBy(reserve.priceInMarketReferenceCurrency)
          .multipliedBy(marketReferencePriceInUsd)
          .shiftedBy(-USD_DECIMALS)
          .toString();
        return [
          {
            ...reserve,
            reserve,
            underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
            ...fetchIconSymbolAndName({
              symbol: baseAssetSymbol,
              underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
            }),
            walletBalance: walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount,
            walletBalanceUSD: walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amountUSD,
            availableToDeposit: baseAvailableToDeposit.toString(),
            availableToDepositUSD: baseAvailableToDepositUSD,
            usageAsCollateralEnabledOnUser,
            detailsAddress: reserve.underlyingAsset,
            id: reserve.id + 'base',
          },
          {
            ...reserve,
            reserve,
            walletBalance,
            walletBalanceUSD,
            availableToDeposit:
              availableToDeposit.toNumber() <= 0 ? '0' : availableToDeposit.toString(),
            availableToDepositUSD:
              Number(availableToDepositUSD) <= 0 ? '0' : availableToDepositUSD.toString(),
            usageAsCollateralEnabledOnUser,
            detailsAddress: reserve.underlyingAsset,
          },
        ];
      }

      return {
        ...reserve,
        reserve,
        walletBalance,
        walletBalanceUSD,
        availableToDeposit:
          availableToDeposit.toNumber() <= 0 ? '0' : availableToDeposit.toString(),
        availableToDepositUSD:
          Number(availableToDepositUSD) <= 0 ? '0' : availableToDepositUSD.toString(),
        usageAsCollateralEnabledOnUser,
        detailsAddress: reserve.underlyingAsset,
      };
    })
    .flat();

  const sortedSupplyReserves = tokensToSupply.sort((a, b) =>
    +a.walletBalanceUSD > +b.walletBalanceUSD ? -1 : 1
  );
  const filteredSupplyReserves = sortedSupplyReserves.filter(
    (reserve) => reserve.availableToDepositUSD !== '0'
  );

  // Filter out reserves
  const supplyReserves: unknown = isShowZeroAssets
    ? sortedSupplyReserves
    : filteredSupplyReserves.length >= 1
    ? filteredSupplyReserves
    : sortedSupplyReserves;

  // Transform to the DashboardReserve schema so the sort utils can work with it
  const preSortedReserves = supplyReserves as DashboardReserve[];
  const sortedReserves = handleSortDashboardReserves(
    sortDesc,
    sortName,
    'assets',
    preSortedReserves
  );
  // console.log(sortedReserves)
  return (
    <Box
      mb={6}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px',
      }}
    >
      {sortedReserves.map((item) => (
        <Box
          key={item.symbol} // Ensure each child has a unique key
          sx={{
            boxSizing: 'border-box',
          }}
        >
          <ListWrapper
            titleComponent={
              <Box>
                <Typography component="p" variant="h3" sx={{ mr: 4 }}>
                  <Trans>Loop Leverage - {item.symbol}</Trans>
                </Typography>
                <Typography component="p" variant="description" sx={{ mr: 4 }} color={'text.muted'}>
                  Wallet Balance: {item.walletBalance}
                </Typography>
              </Box>
            }
            withBottomMargin
          >
            <Box sx={downToSM ? { px: 4, pb: 4 } : { px: 6, pb: 4 }}>
              <Button
                variant="contained"
                href={ROUTES.strategyOverview(item.detailsAddress, currentMarket)}
                fullWidth
              >
                Go to Leverage
              </Button>
            </Box>
          </ListWrapper>
        </Box>
      ))}
    </Box>
  );
};

export default StrategyCard;
