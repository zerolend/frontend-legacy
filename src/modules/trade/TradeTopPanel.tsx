import { Trans } from '@lingui/macro';
import { Box } from '@mui/material';
import * as React from 'react';
import { PageTitle } from 'src/components/TopInfoPanel/PageTitle';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';

export const TradeTopPanel = () => {
  const { currentNetworkConfig } = useProtocolDataContext();

  return (
    <>
      <TopInfoPanel
        titleComponent={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PageTitle
              pageTitle={<Trans>Trade</Trans>}
              withMarketSwitcher={false}
              bridge={currentNetworkConfig.bridge}
            />
          </Box>
        }
        pageDesc={<Trans>See all the rewards you have earned from ZeroLend in one place.</Trans>}
      />
    </>
  );
};
