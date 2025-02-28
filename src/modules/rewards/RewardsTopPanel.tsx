import { Trans } from '@lingui/macro';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';
import { PageTitle } from 'src/components/TopInfoPanel/PageTitle';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import useGetUsersPoints from '../../hooks/points/useGetUsersPoints';
import { GENERAL } from '../../utils/mixPanelEvents';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import { TokenIcon } from '../../components/primitives/TokenIcon';
import { NoData } from '../../components/primitives/NoData';
import { UserZBlastPoints } from '../../components/infoTooltips/UsersZBlastPoints';
import useGetDistributedUsersPoints from '../../hooks/points/useGetDistributedUsersPoints';
import { UserZBlastGoldPoints } from '../../components/infoTooltips/UsersZBlastGoldPoints';
import useGetUserLineaPoints from 'src/hooks/useGetUserLineaPoints';
import { UsersZLineaPoints } from 'src/components/infoTooltips/UsersZLineaPoints';
import { UsersZLineaReferralPoints } from 'src/components/infoTooltips/UsersZLineaReferralPoints';

export const RewardsTopPanel = () => {
  const { currentNetworkConfig } = useProtocolDataContext();
  const userPoints = useGetUsersPoints();
  const userDistributedPoints = useGetDistributedUsersPoints();
  const { currentMarketData } = useProtocolDataContext();

  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';
  const noDataTypographyVariant = downToSM ? 'secondary16' : 'secondary21';
  const userLineaPoints = useGetUserLineaPoints();

  return (
    <>
      <TopInfoPanel
        withMarketSwitcher={true}
        pageTitle={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PageTitle
              pageTitle={<Trans>Rewards 💰</Trans>}
              withMarketSwitcher={false}
              bridge={currentNetworkConfig.bridge}
            />
          </Box>
        }
        pageDesc={
          <Trans>Find all your rewards and incentives for the selected network here.</Trans>
        }
      >
        {currentMarketData.chainId === 59144 && (
          <TopInfoPanelItem
            hideIcon
            title={
              <div style={{ display: 'flex' }}>
                <Trans>Your LXP-L Points</Trans>
                <UsersZLineaPoints
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                  }}
                />
              </div>
            }
            loading={userLineaPoints.isLoading}
          >
            <Box display={'flex'} alignItems={'center'}>
              <FormattedNumber
                value={userLineaPoints.value}
                variant={valueTypographyVariant}
                symbol={'Pts'}
                sx={{ color: '#00FFFF' }}
                visibleDecimals={2}
                compact
                symbolsColor="#A5A8B6"
                symbolsVariant={symbolsVariant}
              />
            </Box>
          </TopInfoPanelItem>
        )}

        {currentMarketData.chainId === 59144 && (
          <TopInfoPanelItem
            hideIcon
            title={
              <div style={{ display: 'flex' }}>
                <Trans>Your LXP From ZL Referrals</Trans>
                <UsersZLineaReferralPoints
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                  }}
                />
              </div>
            }
            loading={userLineaPoints.isLoading}
          >
            <Box display={'flex'} alignItems={'center'}>
              <Typography component="span" variant={'main16'} sx={{ mr: 0.5, color: '#A5A8B6' }}>
                <Trans>Coming Soon</Trans>
              </Typography>
            </Box>
          </TopInfoPanelItem>
        )}

        {/*Blast network points */}
        {currentMarketData.chainId === 81457 && (
          <TopInfoPanelItem
            hideIcon
            title={
              <div style={{ display: 'flex' }}>
                <Trans>Total Blast Points</Trans>
                <UserZBlastPoints
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                  }}
                />
              </div>
            }
            loading={userPoints.isLoading}
          >
            {userPoints.value?.blast ? (
              <Box display={'flex'} alignItems={'center'}>
                <TokenIcon symbol={'Blast'} fontSize={'small'} sx={{ mr: 1 }} />
                <FormattedNumber
                  value={userPoints.value.blast.points.toString()}
                  sx={{ color: '#FCFC03' }}
                  variant={valueTypographyVariant}
                  symbol={'Pts'}
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
        )}
        {/*{currentMarketData.chainId === 81457 &&
          <TopInfoPanelItem
            hideIcon
            title={<div style={{ display: 'flex' }}>
              <Trans>Total Blast Gold Points</Trans>
              <UserZBlastGoldPoints
                event={{
                  eventName: GENERAL.TOOL_TIP,
                }}
              />
            </div>}
            loading={userPoints.isLoading}
          >
            {userPoints.value?.blastGold
              ? <Box display={'flex'} alignItems={'center'}>
                <TokenIcon symbol={'Blast'} fontSize={'small'} sx={{ mr: 1 }} />
                <FormattedNumber
                  value={userPoints.value.blastGold.points.toString()}
                  sx={{ color: '#FCFC03' }}
                  variant={valueTypographyVariant}
                  symbol={'Pts'}
                  visibleDecimals={2}
                  compact
                  symbolsColor="#A5A8B6"
                  symbolsVariant={symbolsVariant}
                />
              </Box>
              : <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
            }
          </TopInfoPanelItem>}*/}

        {currentMarketData.chainId === 81457 && (
          <TopInfoPanelItem
            hideIcon
            title={
              <div style={{ display: 'flex' }}>
                <Trans>Total Blast Gold Points</Trans>
                <UserZBlastGoldPoints
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                  }}
                />
              </div>
            }
            loading={userDistributedPoints.isLoading}
          >
            {userDistributedPoints?.value?.totalBlastGoldPoints ? (
              <Box display={'flex'} alignItems={'center'}>
                <TokenIcon symbol={'Blast'} fontSize={'small'} sx={{ mr: 1 }} />
                {userPoints?.value?.totalBlastPoints?.toString()}
                <FormattedNumber
                  value={userDistributedPoints?.value?.totalBlastGoldPoints?.toString()}
                  sx={{ color: '#FCFC03' }}
                  variant={valueTypographyVariant}
                  symbol={'Pts'}
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
        )}

        {currentMarketData.chainId === 81457 && (
          <TopInfoPanelItem
            hideIcon
            title={
              <div style={{ display: 'flex' }}>
                <Trans>Distributed Blast Points</Trans>
                <UserZBlastPoints
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                  }}
                />
              </div>
            }
            loading={userDistributedPoints.isLoading}
          >
            {userDistributedPoints?.value?.totalBlastPoints ? (
              <Box display={'flex'} alignItems={'center'}>
                <TokenIcon symbol={'Blast'} fontSize={'small'} sx={{ mr: 1 }} />
                {userPoints?.value?.totalBlastPoints?.toString()}
                <FormattedNumber
                  value={userDistributedPoints?.value?.totalBlastPoints?.toString()}
                  sx={{ color: '#FCFC03' }}
                  variant={valueTypographyVariant}
                  symbol={'Pts'}
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
        )}

        {currentMarketData.chainId === 81457 && (
          <TopInfoPanelItem
            hideIcon
            title={
              <div style={{ display: 'flex' }}>
                <Trans>Distributed Blast Gold Points</Trans>
                <UserZBlastGoldPoints
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                  }}
                />
              </div>
            }
            loading={userDistributedPoints.isLoading}
          >
            {userDistributedPoints?.value?.totalBlastGoldPoints ? (
              <Box display={'flex'} alignItems={'center'}>
                <TokenIcon symbol={'Blast'} fontSize={'small'} sx={{ mr: 1 }} />
                {userPoints?.value?.totalBlastPoints?.toString()}
                <FormattedNumber
                  value={userDistributedPoints?.value?.totalBlastGoldPoints?.toString()}
                  sx={{ color: '#FCFC03' }}
                  variant={valueTypographyVariant}
                  symbol={'Pts'}
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
        )}

        {/*Linea network points */}
        {/*{currentMarketData.chainId === 59144 &&
          <TopInfoPanelItem
            hideIcon
            title={<div style={{ display: 'flex' }}>
              <Trans>Linea XP</Trans>
              <TEigenPoints
                event={{
                  eventName: GENERAL.TOOL_TIP,
                }}
              />
            </div>}
            loading={userPoints.isLoading}
          >
            {userPoints.value?.lineaXp
              ? <Box display={'flex'} alignItems={'center'}>
                <TokenIcon symbol={'linea'} fontSize={'small'} sx={{ mr: 1 }} />
                <FormattedNumber
                  value={userPoints.value.lineaXp.points.toString()}
                  variant={valueTypographyVariant}
                  symbol={'Pts'}
                  visibleDecimals={2}
                  compact
                  symbolsColor="#A5A8B6"
                  symbolsVariant={symbolsVariant}
                />
              </Box>
              : <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
            }
          </TopInfoPanelItem>}*/}

        {/*Ethereum LRTs network points */}

        {currentMarketData.chainId === 1 && (
          <TopInfoPanelItem
            hideIcon
            title={
              <div style={{ display: 'flex' }}>
                <Trans>Renzo points</Trans>
              </div>
            }
            loading={userPoints.isLoading}
          >
            {userPoints.value['renzo-1'] ? (
              <Box display={'flex'} alignItems={'center'}>
                <FormattedNumber
                  value={userPoints.value['renzo-1'].points.toString()}
                  variant={valueTypographyVariant}
                  symbol={'Pts'}
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
        )}
        {currentMarketData.chainId === 1 && (
          <TopInfoPanelItem
            hideIcon
            title={
              <div style={{ display: 'flex' }}>
                <Trans>Kelp Miles</Trans>
              </div>
            }
            loading={userPoints.isLoading}
          >
            {userPoints.value['kelp-1'] ? (
              <Box display={'flex'} alignItems={'center'}>
                <FormattedNumber
                  value={userPoints.value['kelp-1'].points.toString()}
                  variant={valueTypographyVariant}
                  symbol={'Miles'}
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
        )}
        {/*{currentMarketData.chainId === 1 &&
          <TopInfoPanelItem
            hideIcon
            title={<div style={{ display: 'flex' }}>
              <Trans>Kelp miles</Trans>
            </div>}
            loading={userPoints.isLoading}
          >
            {userPoints.value?.eigen
              ? <Box display={'flex'} alignItems={'center'}>
                <TokenIcon symbol={'eigenlayer'} fontSize={'small'} sx={{ mr: 1 }} />
                <FormattedNumber
                  value={userPoints.value.eigen.points.toString()}
                  variant={valueTypographyVariant}
                  symbol={'Pts'}
                  visibleDecimals={2}
                  compact
                  symbolsColor="#A5A8B6"
                  symbolsVariant={symbolsVariant}
                />
              </Box>
              : <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
            }
          </TopInfoPanelItem>}*/}
      </TopInfoPanel>
    </>
  );
};
