import { Trans } from '@lingui/macro';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { NoData } from 'src/components/primitives/NoData';
import { ReserveSubheader } from 'src/components/ReserveSubheader';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useRootStore } from 'src/store/root';

import { IncentivesCard } from '../../components/incentives/IncentivesCard';
import { ListColumn } from '../../components/lists/ListColumn';
import { ListItem } from '../../components/lists/ListItem';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { Link, ROUTES } from '../../components/primitives/Link';
import { TokenIcon } from '../../components/primitives/TokenIcon';
import { ComputedReserveData } from '../../hooks/app-data-provider/useAppDataProvider';
import { MARKETS } from '../../utils/mixPanelEvents';
import { valueToBigNumber } from '@aave/math-utils';
import * as React from 'react';
import { CapsCircularStatusTable } from '../../components/caps/CapsCircularStatusTable';
import { useAssetCaps } from '../../hooks/useAssetCaps';
import { IImpliedApr } from '../../hooks/useGetImpliedApr';
import { IncentivesAPRButton } from '../../components/incentives/ImpliedAPRButton';

export const MarketAssetsListItem = ({
  impliedApr,
  ...reserve
}: ComputedReserveData & { impliedApr: IImpliedApr }) => {
  const router = useRouter();
  const { currentMarket, currentMarketData } = useProtocolDataContext();
  const { supplyCap, borrowCap } = useAssetCaps();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const showSupplyCapStatus: boolean = reserve.supplyCap !== '0';
  const showBorrowCapStatus: boolean = reserve.borrowCap !== '0';

  return (
    <ListItem
      px={6}
      minHeight={76}
      onClick={() => {
        trackEvent(MARKETS.DETAILS_NAVIGATION, {
          type: 'Row',
          assetName: reserve.name,
          asset: reserve.underlyingAsset,
          market: currentMarket,
        });
        router.push(ROUTES.reserveOverview(reserve.underlyingAsset, currentMarket));
      }}
      sx={{ cursor: 'pointer' }}
      button
      data-cy={`marketListItemListItem_${reserve.symbol.toUpperCase()}`}
    >
      <ListColumn isRow maxWidth={280}>
        <TokenIcon symbol={reserve.iconSymbol} fontSize="large" />
        <Box sx={{ pl: 3.5, overflow: 'hidden' }}>
          <Typography variant="h4" noWrap>
            {reserve.name}
          </Typography>
          <Box
            sx={{
              p: { xs: '0', xsm: '3.625px 0px' },
            }}
          >
            <Typography variant="subheader2" color="text.muted" noWrap>
              {reserve.symbol}
            </Typography>
          </Box>
          <IncentivesAPRButton
            reserve={reserve}
            impliedApr={impliedApr}
            currentMarketData={currentMarketData}
          />
        </Box>
      </ListColumn>

      <ListColumn>
        <Box display={'flex'} alignItems={'center'}>
          {showSupplyCapStatus && (
            <CapsCircularStatusTable
              value={supplyCap.percentUsed}
              tooltipContent={
                <>
                  <Trans>
                    Maximum amount available to supply is{' '}
                    <FormattedNumber
                      value={
                        valueToBigNumber(reserve.supplyCap).toNumber() -
                        valueToBigNumber(reserve.totalLiquidity).toNumber()
                      }
                      variant="secondary12"
                    />{' '}
                    {reserve.symbol} (
                    <FormattedNumber
                      value={
                        valueToBigNumber(reserve.supplyCapUSD).toNumber() -
                        valueToBigNumber(reserve.totalLiquidityUSD).toNumber()
                      }
                      variant="secondary12"
                      symbol="USD"
                    />
                    ).
                  </Trans>
                </>
              }
            />
          )}
          <Stack>
            <FormattedNumber compact value={reserve.totalLiquidity} variant="main16" />
            <ReserveSubheader value={reserve.totalLiquidityUSD} />
          </Stack>
        </Box>
      </ListColumn>

      <ListColumn>
        <IncentivesCard
          value={reserve.supplyAPY}
          incentives={reserve.aIncentivesData || []}
          symbol={reserve.symbol}
          variant="main16"
          symbolsVariant="secondary16"
          isSupplyApy={true}
        />
      </ListColumn>

      <ListColumn>
        {reserve.borrowingEnabled || Number(reserve.totalDebt) > 0 ? (
          <Box display={'flex'} alignItems={'center'}>
            {showBorrowCapStatus && (
              <CapsCircularStatusTable
                value={borrowCap.percentUsed}
                tooltipContent={
                  <>
                    <Trans>
                      Maximum amount available to borrow is{' '}
                      <FormattedNumber
                        value={
                          valueToBigNumber(reserve.borrowCap).toNumber() -
                          valueToBigNumber(reserve.totalDebt).toNumber()
                        }
                        variant="secondary12"
                      />{' '}
                      {reserve.symbol} (
                      <FormattedNumber
                        value={
                          valueToBigNumber(reserve.borrowCapUSD).toNumber() -
                          valueToBigNumber(reserve.totalDebtUSD).toNumber()
                        }
                        variant="secondary12"
                        symbol="USD"
                      />
                      ).
                    </Trans>
                  </>
                }
              />
            )}
            <Stack>
              <FormattedNumber compact value={reserve.totalDebt} variant="main16" />{' '}
              <ReserveSubheader value={reserve.totalDebtUSD} />
            </Stack>
          </Box>
        ) : (
          <NoData variant={'secondary14'} color="text.secondary" />
        )}
      </ListColumn>

      <ListColumn>
        <IncentivesCard
          value={
            Number(reserve.totalVariableDebtUSD) > 0
              ? currentMarketData.show1DBorrowAPR
                ? reserve.borrowAPY1D
                : reserve.variableBorrowAPY
              : '-1'
          }
          incentives={reserve.vIncentivesData || []}
          symbol={reserve.symbol}
          variant="main16"
          symbolsVariant="secondary16"
        />
        {!reserve.borrowingEnabled &&
          Number(reserve.totalVariableDebt) > 0 &&
          !reserve.isFrozen && <ReserveSubheader value={'Disabled'} />}
      </ListColumn>

      {/*<ListColumn>
        <IncentivesCard
          value={Number(reserve.totalStableDebtUSD) > 0 ? reserve.stableBorrowAPY : '-1'}
          incentives={reserve.sIncentivesData || []}
          symbol={reserve.symbol}
          variant="main16"
          symbolsVariant="secondary16"
        />
        {!reserve.borrowingEnabled && Number(reserve.totalStableDebt) > 0 && !reserve.isFrozen && (
          <ReserveSubheader value={'Disabled'} />
        )}
      </ListColumn>*/}

      <ListColumn minWidth={95} maxWidth={95} align="right">
        <Button
          variant="outlined"
          component={Link}
          href={ROUTES.reserveOverview(reserve.underlyingAsset, currentMarket)}
          onClick={() =>
            trackEvent(MARKETS.DETAILS_NAVIGATION, {
              type: 'Button',
              assetName: reserve.name,
              asset: reserve.underlyingAsset,
              market: currentMarket,
            })
          }
        >
          <Trans>Details</Trans>
        </Button>
      </ListColumn>
    </ListItem>
  );
};
