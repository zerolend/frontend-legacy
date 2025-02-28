import { ChainId } from '@aave/contract-helpers';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';

import { BorrowAssetsList } from './lists/BorrowAssetsList/BorrowAssetsList';
import { BorrowedPositionsList } from './lists/BorrowedPositionsList/BorrowedPositionsList';
import { SuppliedPositionsList } from './lists/SuppliedPositionsList/SuppliedPositionsList';
import { SupplyAssetsList } from './lists/SupplyAssetsList/SupplyAssetsList';
import { InterimUIRedirectModal } from 'src/components/InterimUiRedirectModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { ListWrapper } from '../../components/lists/ListWrapper';
import { Trans } from '@lingui/macro';
import { linkNew } from '../../ui-config/marketsConfig';
import { Link } from 'src/components/primitives/Link';

interface DashboardContentWrapperProps {
  isBorrow: boolean;
}

export const DashboardContentWrapper = ({ isBorrow }: DashboardContentWrapperProps) => {
  const { breakpoints } = useTheme();
  const { currentMarket, currentMarketData } = useProtocolDataContext();

  const isDesktop = useMediaQuery(breakpoints.up('lg'));
  const paperWidth = isDesktop ? 'calc(50% - 8px)' : '100%';

  if (currentMarketData.switchToNewUI) {
    const linkOld = 'http://legacy.zerolend.xyz/?marketName=' + currentMarket;

    return (
      <ListWrapper
        titleComponent={
          <Typography variant="h2" mb={3}>
            <Trans>This market has been moved to the new UI</Trans>
          </Typography>
        }
      >
        <Box px={6} pb={6}>
          <Typography mb={6}>
            <Trans>
              This market is now accessible via the new ZeroLend UI. The new UI offers a more
              user-friendly experience and additional features that are not available on this version.
            </Trans>
          </Typography>
          <Typography mb={6}>
            <Trans>
              If you choose not to use the new UI, you can continue to use the legacy UI over at{' '}
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
            {/* <SvgIcon fontSize="small" sx={{ mx: 1 }}>
            <LogoutIcon />
          </SvgIcon> */}
            <Trans>Take Me To The New UI 🚀</Trans>
          </Button>
        </Box>

      </ListWrapper>
    );
  }

  return (
    <Box>
      <InterimUIRedirectModal open={currentMarketData.switchToNewUI} marketId={currentMarket} />

      {currentMarketData.chainId === ChainId.polygon && !currentMarketData.v3}
      <Box
        sx={{
          display: isDesktop ? 'flex' : 'block',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ display: { xs: isBorrow ? 'none' : 'block', lg: 'block' }, width: paperWidth }}>
          <SuppliedPositionsList />
          <SupplyAssetsList />
        </Box>

        <Box sx={{ display: { xs: !isBorrow ? 'none' : 'block', lg: 'block' }, width: paperWidth }}>
          <BorrowedPositionsList />
          <BorrowAssetsList />
        </Box>
      </Box>
    </Box>
  );
};
