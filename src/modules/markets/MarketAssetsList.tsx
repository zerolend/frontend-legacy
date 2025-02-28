import { Trans } from '@lingui/macro';
import { Typography, useMediaQuery } from '@mui/material';
import { useMemo, useState } from 'react';
import { VariableAPYTooltip } from 'src/components/infoTooltips/VariableAPYTooltip';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';

import { MarketAssetsListItem } from './MarketAssetsListItem';
import { MarketAssetsListItemLoader } from './MarketAssetsListItemLoader';
import { MarketAssetsListMobileItem } from './MarketAssetsListMobileItem';
import { MarketAssetsListMobileItemLoader } from './MarketAssetsListMobileItemLoader';
import { moveElementsInArray } from '../../utils/dashboardSortUtils';
import { useProtocolDataContext } from '../../hooks/useProtocolDataContext';
import { AssetCapsProvider } from '../../hooks/useAssetCaps';
import { IImpliedApr } from '../../hooks/useGetImpliedApr';
import { Warning } from 'src/components/primitives/Warning';


/*
const listHeaders = [
  {
    title: <Trans>Asset</Trans>,
    sortKey: 'symbol',
  },
  {
    title: <Trans>Total supplied</Trans>,
    sortKey: 'totalLiquidityUSD',
  },
  {
    title: <Trans>Supply APY</Trans>,
    sortKey: 'supplyAPY',
  },
  {
    title: <Trans>Total borrowed</Trans>,
    sortKey: 'totalDebtUSD',
  },
  {
    title: (
      <VariableAPYTooltip
        text={<Trans>Borrow APY, variable</Trans>}
        key="APY_list_variable_type"
        variant="subheader2"
      />
    ),
    sortKey: 'variableBorrowAPY',
  },
  /!*{
    title: (
      <StableAPYTooltip
        text={<Trans>Borrow APY, stable</Trans>}
        key="APY_list_stable_type"
        variant="subheader2"
      />
    ),
    sortKey: 'stableBorrowAPY',
  },*!/
];
*/

const borrowApy = {
  title: (
    <VariableAPYTooltip
      text={<Trans>Borrow APY, variable</Trans>}
      key="APY_list_variable_type"
      variant="subheader2"
    />
  ),
  sortKey: 'variableBorrowAPY',
};

const borrowApy1D = {
  title: (
    <VariableAPYTooltip
      text={<Trans>Daily Borrow APY</Trans>}
      key="APY_list_variable_type"
      variant="subheader2"
    />
  ),
  sortKey: 'variableBorrowAPY',
};

type MarketAssetsListProps = {
  reserves: ComputedReserveData[];
  loading: boolean;
  impliedApr: IImpliedApr
};

export default function MarketAssetsList({ reserves, impliedApr, loading }: MarketAssetsListProps) {
  const isTableChangedToCards = useMediaQuery('(max-width:1125px)');
  const { currentMarketData } = useProtocolDataContext();
  const [sortName, setSortName] = useState('');
  const [sortDesc, setSortDesc] = useState(false);

  const listHeaders = [
    {
      title: <Trans>Asset</Trans>,
      sortKey: 'symbol',
    },
    {
      title: <Trans>Total supplied</Trans>,
      sortKey: 'totalLiquidityUSD',
    },
    {
      title: <Trans>Supply APY</Trans>,
      sortKey: 'supplyAPY',
    },
    {
      title: <Trans>Total borrowed</Trans>,
      sortKey: 'totalDebtUSD',
    },
    currentMarketData.show1DBorrowAPR ? borrowApy1D : borrowApy,
  ];

  if (sortDesc) {
    if (sortName === 'symbol') {
      reserves.sort((a, b) => (a.symbol.toUpperCase() < b.symbol.toUpperCase() ? -1 : 1));
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      reserves.sort((a, b) => a[sortName] - b[sortName]);
    }
  } else {
    if (sortName === 'symbol') {
      reserves.sort((a, b) => (b.symbol.toUpperCase() < a.symbol.toUpperCase() ? -1 : 1));
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      reserves.sort((a, b) => b[sortName] - a[sortName]);
    }
  }

  const moveBorrowingDisabledAssetToBottom = (_rArr: ComputedReserveData[]) => {
    let filReserve = _rArr;
    const countAssets = filReserve.filter(
      (_r) =>
        (!_r.borrowingEnabled && Number(_r.totalVariableDebt) > 0 && !_r.isFrozen) ||
        Number(_r.variableBorrowAPY) === 0
    );
    let count = countAssets.length;
    while (count > 0) {
      const index = filReserve.findIndex(
        (_r) =>
          (!_r.borrowingEnabled && Number(_r.totalVariableDebt) > 0 && !_r.isFrozen) ||
          Number(_r.variableBorrowAPY) === 0
      );
      if (index !== -1) {
        filReserve = moveElementsInArray(filReserve, index, filReserve.length - 1);
      }
      count = count - 1;
    }
    return filReserve;
  };

  const filteredReserves = useMemo(() => {
    if (reserves.length > 0) {
      let filReserve = reserves;
      filReserve = moveBorrowingDisabledAssetToBottom(filReserve);

      const index = reserves.findIndex((_r) => _r.symbol === 'ETH' || _r.symbol === 'WETH');
      if (index !== -1) {
        filReserve = moveElementsInArray(reserves, index, 0);
      }

      return filReserve;
    } else {
      return reserves;
    }
  }, [reserves]);

  // Show loading state when loading
  if (loading) {
    return isTableChangedToCards ? (
      <>
        <MarketAssetsListMobileItemLoader />
        <MarketAssetsListMobileItemLoader />
        <MarketAssetsListMobileItemLoader />
      </>
    ) : (
      <>
        <MarketAssetsListItemLoader />
        <MarketAssetsListItemLoader />
        <MarketAssetsListItemLoader />
        <MarketAssetsListItemLoader />
        <MarketAssetsListItemLoader />
      </>
    );
  }

  // Hide list when no results, via search term or if a market has all/no frozen/unfrozen assets
  if (reserves.length === 0) return null;

  return (
    <>
      {currentMarketData.isAlpha && (
        <Warning
          severity="error"
          // severity="warning"
          icon={false}
          sx={{
            px: { xs: 6, md: 8, borderRadius: 0, marginBottom: 0 },
          }}
        >
          <Typography variant="subheader1">
            <Trans>This Market is currently in Alpha! 👶🏻</Trans>
          </Typography>
          <Typography variant="caption">
            <Trans>
              This market is currently under development and is not meant to be used with real funds just yet. Once the market is configured and tested, it will be moved to the mainnet and this warning will be removed.
            </Trans>
          </Typography>
        </Warning>
      )
      }
      {!isTableChangedToCards && (
        <ListHeaderWrapper px={6}>
          {listHeaders.map((col) => (
            <ListColumn
              isRow={col.sortKey === 'symbol'}
              maxWidth={col.sortKey === 'symbol' ? 280 : undefined}
              key={col.sortKey}
            >
              <ListHeaderTitle
                sortName={sortName}
                sortDesc={sortDesc}
                setSortName={setSortName}
                setSortDesc={setSortDesc}
                sortKey={col.sortKey}
                source="Markets Page"
              >
                {col.title}
              </ListHeaderTitle>
            </ListColumn>
          ))}
          <ListColumn maxWidth={95} minWidth={95} />
        </ListHeaderWrapper>
      )}

      {filteredReserves.map((reserve) => {
        if (reserve.symbol === 'KS-LP USDC.e-USDT' || reserve.symbol === 'PEPE') return null;
        return (
          <AssetCapsProvider asset={reserve} key={reserve.id}>
            {isTableChangedToCards ? (
              <MarketAssetsListMobileItem {...reserve} key={reserve.id} impliedApr={impliedApr} />
            ) : (
              <MarketAssetsListItem {...reserve} key={reserve.id} impliedApr={impliedApr} />
            )}
          </AssetCapsProvider>
        );
      })}
    </>
  );
}
