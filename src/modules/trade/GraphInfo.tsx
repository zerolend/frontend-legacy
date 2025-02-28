import Box from '@mui/material/Box';
import React from 'react';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { Trans } from '@lingui/macro';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { NoData } from '../../components/primitives/NoData';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import { useMediaQuery, useTheme } from '@mui/material';
import Charts from './Charts';

const GraphInfo = () => {
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const noDataTypographyVariant = downToSM ? 'secondary16' : 'secondary21';

  return (
    <ListWrapper titleComponent={''}>
      <Box px={6} pb={6}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: { xs: 3, xsm: 8 },
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          <TopInfoPanelItem title={<Trans>Buy Price</Trans>} loading={false} hideIcon>
            {true ? (
              <FormattedNumber
                value={Number(900)}
                symbol="ETH"
                variant={valueTypographyVariant}
                visibleDecimals={2}
                compact
                symbolsColor="#A5A8B6"
                symbolsVariant={noDataTypographyVariant}
              />
            ) : (
              <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
            )}
          </TopInfoPanelItem>
          <TopInfoPanelItem title={<Trans>Reserve</Trans>} loading={false} hideIcon>
            {true ? (
              <FormattedNumber
                value={Number(5000)}
                symbol="ETH"
                variant={valueTypographyVariant}
                visibleDecimals={2}
                compact
                symbolsColor="#A5A8B6"
                symbolsVariant={noDataTypographyVariant}
              />
            ) : (
              <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
            )}
          </TopInfoPanelItem>
          <TopInfoPanelItem title={<Trans>Curve Insurance</Trans>} loading={false} hideIcon>
            {true ? (
              <FormattedNumber
                value={Number(23000)}
                symbol="ZERO"
                variant={valueTypographyVariant}
                visibleDecimals={2}
                compact
                symbolsColor="#A5A8B6"
                symbolsVariant={noDataTypographyVariant}
              />
            ) : (
              <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
            )}
          </TopInfoPanelItem>
          <TopInfoPanelItem title={<Trans>Total Supply</Trans>} loading={false} hideIcon>
            {true ? (
              <FormattedNumber
                value={Number(27000)}
                symbol="ZERO"
                variant={valueTypographyVariant}
                visibleDecimals={2}
                compact
                symbolsColor="#A5A8B6"
                symbolsVariant={noDataTypographyVariant}
              />
            ) : (
              <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
            )}
          </TopInfoPanelItem>
        </Box>
        <Box mt={6}>
          <Charts />
        </Box>
      </Box>
    </ListWrapper>
  );
};

export default GraphInfo;
