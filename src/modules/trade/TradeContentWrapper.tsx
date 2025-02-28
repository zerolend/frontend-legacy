import { ChainId } from '@aave/contract-helpers';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useRootStore } from 'src/store/root';
import Trade from './Trade';
import GraphInfo from './GraphInfo';

export const TradeContentWrapper = () => {
  const { breakpoints } = useTheme();
  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const isDesktop = useMediaQuery(breakpoints.up('lg'));
  const tradeWidth = isDesktop ? 'calc(40% - 8px)' : '100%';
  const graphWidth = isDesktop ? 'calc(60% - 8px)' : '100%';
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
        <Box sx={{ display: { xs: 'block', lg: 'block' }, width: graphWidth }}>
          <GraphInfo />
        </Box>

        <Box sx={{ display: { xs: 'block', lg: 'block' }, width: tradeWidth }}>
          <Trade />
        </Box>
      </Box>
    </Box>
  );
};
