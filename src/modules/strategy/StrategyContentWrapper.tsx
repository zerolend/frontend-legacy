import { ChainId } from '@aave/contract-helpers';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useRootStore } from 'src/store/root';
import { useEffect } from 'react';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { CustomMarket } from 'src/ui-config/marketsConfig';
import StrategyCard from './StrategyCard';

export const StrategyContentWrapper = () => {
  const { breakpoints } = useTheme();
  const { setCurrentMarket } = useProtocolDataContext();

  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const isDesktop = useMediaQuery(breakpoints.up('lg'));
  const paperWidth = '100%';

  useEffect(() => {
    setCurrentMarket(CustomMarket.proto_linea_v3);
  }, []);

  return (
    <Box>
      {currentMarketData.chainId === ChainId.polygon && !currentMarketData.v3}
      <Box
        sx={{
          display: isDesktop ? 'flex' : 'block',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ display: { xs: 'block', lg: 'block' }, width: paperWidth }}>
          <StrategyCard />
        </Box>
      </Box>
    </Box>
  );
};
