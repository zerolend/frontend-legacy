import { Box, Button, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { NoData } from '../../components/primitives/NoData';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import { useModalContext } from '../../hooks/useModal';
import { useGetLPAPR } from 'src/hooks/useGetLPAPR';
import { PointsIncentivesButton } from '../../components/incentives/PointsIncentivesButton';
import { defaultLPStakePoints } from '../../ui-config/pointsConfig-v2';
import { zeroConfig } from 'src/ui-config/zeroConfig';
import { useSharedDependencies } from 'src/ui-config/SharedDependenciesProvider';
import { normalizeBN } from '@aave/math-utils';
import { Link } from '../../components/primitives/Link';

const StakeLpBanner = () => {
  const { openLockedDLP, openLockLPModal } = useModalContext();
  const { tokenBalanceService } = useSharedDependencies();
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';
  const noDataTypographyVariant = downToSM ? 'secondary16' : 'secondary21';
  const getTokenBalance = tokenBalanceService.getTokenBalanceOf;
  const [locked, setLocked] = useState<string>('');
  const getAPY = useGetLPAPR();

  const ETHZero = 6753941;

  useEffect(() => {
    LpLocked();
  }, [tokenBalanceService]);

  const LpLocked = async () => {
    const totalLPZeroLocked = await getTokenBalance({
      tokenAddress: zeroConfig.crossChainAddresses[zeroConfig.chainId].ETH_ZERO_PAIR,
      user: zeroConfig.crossChainAddresses[zeroConfig.chainId].LOCKER_LP,
    });

    totalLPZeroLocked.mul(ETHZero);

    setLocked(totalLPZeroLocked.toString());
  };

  return (
    <Paper sx={{ pt: 4 }}>
      <Box px={6}>
        <Box mb={4} pb={6}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
            <Box>
              <Typography component="div" variant="h3" sx={{ mb: 0 }}>
                Stake zLP (ZERO/ETH LP)
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
                LP token stakers earn protocol revenue generated through interest fees paid by
                borrowers. Payouts in ETH. If you don&apos;t have any LP tokens, Visit the{' '}
                <Link
                  href={
                    'https://www.nile.build/manage/v1/0x0040f36784dda0821e74ba67f86e084d70d67a3a'
                  }
                  target="_blank"
                >
                  ZERO/ETH liquidity
                </Link>{' '}
                page on Nile and supply liquidity to get LP tokens to stake.
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="flex-start" mb={4}>
            <TopInfoPanelItem
              hideIcon
              title={
                <div style={{ display: 'flex' }}>
                  <Trans>Total LP Locked</Trans>
                </div>
              }
              loading={false}
            >
              {locked ? (
                <Box>
                  <FormattedNumber
                    value={normalizeBN(locked, 18).toString()}
                    variant={valueTypographyVariant}
                    visibleDecimals={2}
                    compact
                    symbol="USD"
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
                  <Trans>APR upto</Trans>
                </div>
              }
              loading={false}
              withLine
            >
              {getAPY ? (
                <Box>
                  <FormattedNumber
                    value={getAPY}
                    variant={valueTypographyVariant}
                    visibleDecimals={2}
                    compact
                    symbol="ETH"
                    symbolsColor="#A5A8B6"
                    symbolsVariant={symbolsVariant}
                    percent={true}
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
                  <Trans>Incentives</Trans>
                </div>
              }
              loading={false}
              withLine
            >
              <Box>
                {defaultLPStakePoints.map((data, index) => {
                  return <PointsIncentivesButton {...data} key={index} />;
                })}
              </Box>
            </TopInfoPanelItem>
          </Box>
          <Box mt={4}>
            <Button variant="contained" onClick={() => openLockedDLP()} sx={{ mr: 4 }}>
              <Trans>Zap and Stake ⚡️</Trans>
            </Button>
            <Button variant="contained" onClick={() => openLockLPModal()}>
              <Trans>Stake ZERO/ETH LP</Trans>
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default StakeLpBanner;
