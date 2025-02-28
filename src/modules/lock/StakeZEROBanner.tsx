import { Box, Button, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import React from 'react';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { NoData } from '../../components/primitives/NoData';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import { useModalContext } from '../../hooks/useModal';
import { normalize } from '@aave/math-utils';
import LockerGlobalData from '../../hooks/app-data-provider/LockerGlobalData';
import { useGetRewardRateValue } from '../../hooks/useGetRewardRateValue';

const StakeZEROBanner = () => {
  const { openNewLockZeroModal } = useModalContext();
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';
  const noDataTypographyVariant = downToSM ? 'secondary16' : 'secondary21';

  const { data: TotalZeroLocked, avgLock: avgLock, isLoading: loading } = LockerGlobalData();
  const getAPY = useGetRewardRateValue();

  return (
    <Paper sx={{ pt: 4 }}>
      <Box px={6}>
        <Box mb={4} pb={6}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
            <Box>
              <Typography component="div" variant="h3" sx={{ mb: 0 }}>
                Stake ZERO to participate in governance
              </Typography>
              <Typography
                component="p"
                variant="caption"
                fontSize={14}
                sx={{ mr: 4 }}
                lineHeight={1.5}
                color={'text.muted'}
                maxWidth={780}
              >
                Earn a yield in ZERO tokens and farm potential airdrops by staking ZERO. You can also
                vote on gauges and decide where ZERO emissions will go.
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="flex-start" mb={4}>
            <TopInfoPanelItem
              hideIcon
              title={
                <div style={{ display: 'flex' }}>
                  <Trans>Total locked</Trans>
                </div>
              }
              loading={loading}
            >
              {TotalZeroLocked ? (
                <Box display={'flex'} alignItems={'center'}>
                  <FormattedNumber
                    value={normalize(TotalZeroLocked, 18).toString()}
                    variant={valueTypographyVariant}
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
            <TopInfoPanelItem
              hideIcon
              title={
                <div style={{ display: 'flex' }}>
                  <Trans>Avg. Locking Period</Trans>
                </div>
              }
              loading={loading}
              withLine
            >
              {avgLock ? (
                <Box display={'flex'} alignItems={'center'}>
                  <FormattedNumber
                    value={avgLock}
                    variant={valueTypographyVariant}
                    visibleDecimals={2}
                    compact
                    symbolsColor="#A5A8B6"
                    symbolsVariant={symbolsVariant}
                    symbol={avgLock === 1 ? 'year' : 'years'}
                  />
                </Box>
              ) : (
                <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
              )}
            </TopInfoPanelItem>
            <TopInfoPanelItem
              hideIcon
              title={
                <div style={{ display: 'flex' }}>
                  <Trans>APR upto</Trans>
                </div>
              }
              loading={loading}
              withLine
            >
              {getAPY ? (
                <Box display={'flex'} alignItems={'center'}>
                  <FormattedNumber
                    value={getAPY}
                    variant={valueTypographyVariant}
                    visibleDecimals={2}
                    compact
                    symbolsColor="#A5A8B6"
                    symbolsVariant={symbolsVariant}
                    percent={true}
                  />
                </Box>
              ) : (
                <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
              )}
            </TopInfoPanelItem>
          </Box>

          <Box mt={4}>
            <Button variant="contained" onClick={openNewLockZeroModal} sx={{ mr: 4 }}>
              <Trans>Stake ZERO</Trans>
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default StakeZEROBanner;
