import { Box, Typography } from '@mui/material';
import StyledToggleButtonGroup from './StyledToggleButtonGroup';
import { CustomMarket, MarketDataType, marketsData } from '../ui-config/marketsConfig';
import StyledToggleButton from './StyledToggleButton';
import { Trans } from '@lingui/macro';
import { useMemo } from 'react';
import { useProtocolDataContext } from '../hooks/useProtocolDataContext';

const IsolatedMarketSwitcher = () => {
  const { currentMarket, setCurrentMarket, currentMarketData } = useProtocolDataContext();

  const grpMarkets = useMemo(() => {
    const markets: { [key: string]: MarketDataType } = {};
    if (currentMarketData?.grpKey) {
      Object.entries(marketsData).map(([key, data]) => {
        if (data?.grpKey && currentMarketData?.grpKey === data?.grpKey) {
          markets[key] = data;
        }
      });
    }
    return markets;
  }, [currentMarketData, marketsData]);

  if (Object.entries(grpMarkets).length <= 1) return <div />;

  return (
    <Box
      sx={{
        display: { xs: 'flex' },
        justifyContent: { xs: 'center', xsm: 'flex-start' },
        // mb: { xs: 3, xsm: 4, md: 4 },
        mb: 3,
      }}
    >
      <StyledToggleButtonGroup
        color="primary"
        exclusive
        value={`${currentMarket}`}
        onChange={(_, value) => {
          setCurrentMarket(value as unknown as CustomMarket);
        }}
        sx={{ width: {xs: '100%', md: 'auto'}, height: '44px' }}
      >
        {Object.entries(grpMarkets).map(([key, data]) => {
          const dataKey = `${key}`;
          const valueKey = `${currentMarket}`;

          return (
            <StyledToggleButton value={`${dataKey}`} key={`${dataKey}`} disabled={valueKey === dataKey}>
              <Typography variant="subheader1" width={'max-content'}>
                <Trans>{data.marketAltName}</Trans>
              </Typography>
            </StyledToggleButton>
          );
        })}
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default IsolatedMarketSwitcher;
