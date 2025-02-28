import { API_ETH_MOCK_ADDRESS } from '@aave/contract-helpers';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { fetchIconSymbolAndName } from 'src/ui-config/reservePatches';
import { getGhoReserve, GHO_SUPPORTED_MARKETS, GHO_SYMBOL } from 'src/utils/ghoUtilities';
import { InterimUIRedirectModal } from 'src/components/InterimUiRedirectModal';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { MarketBanner } from './MarketBanners';
import { marketMainBanners } from '../../ui-config/ui-banners-config';
import { MarketWarning } from 'src/components/transactions/Warnings/MarketWarning';
import { NoSearchResults } from 'src/components/NoSearchResults';
import { TitleWithSearchBar } from 'src/components/TitleWithSearchBar';
import { Trans } from '@lingui/macro';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useState } from 'react';
import { Warning } from 'src/components/primitives/Warning';
import MarketAssetsList from 'src/modules/markets/MarketAssetsList';
import useGetImpliedApr from '../../hooks/useGetImpliedApr';
import { linkNew } from '../../ui-config/marketsConfig';
import { Link } from 'src/components/primitives/Link';

// import { GENERAL } from '../../utils/mixPanelEvents';
// import { GhoBanner } from './Gho/GhoBanner';
// import { AirdropBanner } from './Airdrop/AirdropBanner';
// import { AirdropZillion } from './Airdrop/AirdropZillion';
// import { ClaimAirdrop } from './Airdrop/ClaimAirdrop';

export const MarketAssetsListContainer = () => {
  const { reserves, loading } = useAppDataContext();
  const aprData = useGetImpliedApr();
  const { currentMarket, currentMarketData, currentNetworkConfig } = useProtocolDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down('sm'));

  const ghoReserve = getGhoReserve(reserves);
  const filteredData = reserves
    // Filter out any non-active reserves
    .filter((res) => res.isActive)
    // Filter out all GHO, as we deliberately display it on supported markets
    .filter((res) => res !== ghoReserve)
    // filter out any that don't meet search term criteria
    .filter((res) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase().trim();
      return (
        res.symbol.toLowerCase().includes(term) ||
        res.name.toLowerCase().includes(term) ||
        res.underlyingAsset.toLowerCase().includes(term)
      );
    })
    // Transform the object for list to consume it
    .map((reserve) => ({
      ...reserve,
      ...(reserve.isWrappedBaseAsset
        ? fetchIconSymbolAndName({
          symbol: currentNetworkConfig.baseAssetSymbol,
          underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
        })
        : {}),
    }));
  const marketFrozen = !reserves.some((reserve) => !reserve.isFrozen);
  const showFrozenMarketWarning =
    marketFrozen && ['Harmony', 'Fantom', 'Ethereum AMM'].includes(currentMarketData.marketTitle);
  const unfrozenReserves = filteredData.filter((r) => !r.isFrozen && !r.isPaused);
  const frozenOrPausedReserves = filteredData.filter((r) => r.isFrozen || r.isPaused);

  // Determine if to show GHO market list item
  const shouldDisplayGho = (marketTitle: string, searchTerm: string): boolean => {
    if (!GHO_SUPPORTED_MARKETS.includes(marketTitle)) {
      return false;
    }

    if (!searchTerm) {
      return true;
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    return (
      normalizedSearchTerm.length <= 3 && GHO_SYMBOL.toLowerCase().includes(normalizedSearchTerm)
    );
  };
  const displayGho: boolean = shouldDisplayGho(currentMarket, searchTerm);

  if (currentMarketData.switchToNewUI) {
    const linkOld = 'http://legacy.zerolend.xyz/?marketName=' + currentMarket;

    return (
      <ListWrapper
        titleComponent={
          <Typography variant="h2">
            <Trans>This market has been moved to the new UI</Trans>
          </Typography>
        }
      >
        <Box px={6} pb={6}>
          <Typography mb={6}>
            <Trans>
              This market is now accessible via the new ZeroLend UI. The new UI offers a more
              user-friendly experience and provides additional features that are not available on this version.
            </Trans>
          </Typography>
          <Typography mb={6}>
            <Trans>
              If you choose not to use the new UI, you can continue to access this market using the legacy UI over at{' '}
              <Link color={'blue'} href={linkOld}>
                legacy.zerolend.xyz
              </Link>
              .
            </Trans>
          </Typography>
          <Button
            variant="contained"
            href={`${linkNew}/market/?marketName=${currentMarket}`}
          >
            <Trans>Take me to the new UI 🚀</Trans>
          </Button>
        </Box>

      </ListWrapper>
    );
  }

  return (
    <>
      <InterimUIRedirectModal open={currentMarketData.switchToNewUI} marketId={currentMarket} />

      <ListWrapper
        titleComponent={
          <TitleWithSearchBar
            onSearchTermChange={setSearchTerm}
            title={
              <>
                {currentMarketData.marketTitle} <Trans>assets</Trans>
              </>
            }
            searchPlaceholder={sm ? 'Search asset' : 'Search asset name, symbol, or address'}
          />
        }
      >
        {showFrozenMarketWarning && (
          <Box mx={6}>
            <MarketWarning marketName={currentMarketData.marketTitle} forum />
          </Box>
        )}

        {marketMainBanners[currentMarket] && (
          <Box mb={4}>
            <MarketBanner {...marketMainBanners[currentMarket]} />
          </Box>
        )}

        {/* Unfrozen assets list */}
        <MarketAssetsList reserves={unfrozenReserves} loading={loading} impliedApr={aprData} />

        {/* Show no search results message if nothing hits in either list */}
        {!loading && filteredData.length === 0 && !displayGho && (
          <NoSearchResults
            searchTerm={searchTerm}
            subtitle={
              <Trans>
                We couldn&apos;t find any assets related to your search. Try again with a different
                asset name, symbol, or address.
              </Trans>
            }
          />
        )}
      </ListWrapper>

      {frozenOrPausedReserves.length > 0 && (
        <ListWrapper withTopMargin titleComponent={<div />}>
          <Box sx={{ px: { xs: 4, xsm: 6 } }}>
            <Typography variant="h4" mb={4}>
              <Trans>Frozen or paused assets</Trans>
            </Typography>
            <Warning severity="info">
              <Trans>
                These assets are temporarily frozen or paused by ZeroLend community decisions,
                meaning that further supply / borrow, or rate swap of these assets are unavailable.
                Withdrawals and debt repayments are allowed.
              </Trans>
            </Warning>
          </Box>

          <MarketAssetsList
            reserves={frozenOrPausedReserves}
            loading={loading}
            impliedApr={aprData}
          />
        </ListWrapper>
      )}
    </>
  );
};
