import { Trans } from '@lingui/macro';
import { Box } from '@mui/material';
import * as React from 'react';
import { PageTitle } from 'src/components/TopInfoPanel/PageTitle';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';

export const StrategyTopPanel = () => {
  const { currentNetworkConfig } = useProtocolDataContext();

  return (
    <>
      <TopInfoPanel
        withMarketSwitcher={true}
        pageTitle={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PageTitle
              pageTitle={<Trans>Strategy</Trans>}
              withMarketSwitcher={false}
              bridge={currentNetworkConfig.bridge}
            />
          </Box>
        }
        pageDesc={<Trans>Select the strategy.</Trans>}
      ></TopInfoPanel>
    </>
  );
};
