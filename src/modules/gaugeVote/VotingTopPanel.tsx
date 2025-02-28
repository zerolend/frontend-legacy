import { Trans } from '@lingui/macro';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';
import { PageTitle } from 'src/components/TopInfoPanel/PageTitle';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { NoData } from '../../components/primitives/NoData';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import { ChainAvailabilityText } from '../../components/ChainAvailabilityText';

export const VotingTopPanel = () => {
  const { currentNetworkConfig } = useProtocolDataContext();

  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';
  const noDataTypographyVariant = downToSM ? 'secondary16' : 'secondary21';

  return (
    <>
      <TopInfoPanel
        titleComponent={
          <>
            <ChainAvailabilityText wrapperSx={{ mb: 4 }} chainId={59144} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* <TokenIcon symbol={'zero'} fontSize={'large'} /> */}
              <PageTitle
                pageTitle={<Trans>Incentive Voting</Trans>}
                withMarketSwitcher={false}
                bridge={currentNetworkConfig.bridge}
              />
            </Box>
          </>
        }
        pageDesc={<Trans>Vote on pools that will receive ZERO emissions.</Trans>}
      >
        <TopInfoPanelItem
          hideIcon
          title={
            <div style={{ display: 'flex' }}>
              <Trans>Your Voting Power</Trans>
            </div>
          }
          loading={false}
        >
          {false ? (
            <Box display={'flex'} alignItems={'center'}>
              <FormattedNumber
                value={'14314'}
                variant={valueTypographyVariant}
                symbol={'veZERO'}
                visibleDecimals={2}
                compact
                symbolsColor="#A5A8B6"
                symbolsVariant={symbolsVariant}
              />
            </Box>
          ) : (
            <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
          )}
        </TopInfoPanelItem>
      </TopInfoPanel>
    </>
  );
};
