import { Trans } from '@lingui/macro';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import { NoData } from '../../components/primitives/NoData';
import useGetGravityPublicGlobalData from '../../hooks/gravity/useGetGravityPublicGlobalData';
import { IGravityPublicUserData } from '../../hooks/gravity/useGetGravityPublicUserData';
import { IUsersCurrentPointsData } from '../../hooks/gravity/useGetUsersCurrentPointsData';
import { TextWithTooltip } from '../../components/TextWithTooltip';

interface IProps {
  userData: IGravityPublicUserData;
  userCurrentPoints: IUsersCurrentPointsData;
  currentSeason: { loading: boolean; value: number };
}

export const GravityTopPanel = (props: IProps) => {
  const { userData, userCurrentPoints } = props;
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';
  const noDataTypographyVariant = downToSM ? 'secondary16' : 'secondary21';

  const globalPoints = useGetGravityPublicGlobalData();

  return (
    <>
      <TopInfoPanel
        withMarketSwitcher={false}
        pageTitle={<Trans>ZERO Gravity 🚀</Trans>}
        pageDesc={<Trans>Find all your ZERO Points for Chapter 2 here. 2% of the supply is up for grabs!</Trans>}
      >
        <TopInfoPanelItem
          hideIcon
          title={
            <div style={{ display: 'flex' }}>
              <Trans>Your Rank</Trans>
              <TextWithTooltip>
                <Trans>
                  The rank is calculated based on the total points you have earned. The more points you have, the higher your rank.
                </Trans>
              </TextWithTooltip>
            </div>
          }
          loading={userData.isLoading}
        >
          {userData.value.rank ? (
            <Box display={'flex'} alignItems={'center'}>
              <FormattedNumber
                value={userData.value.rank}
                variant={valueTypographyVariant}
                visibleDecimals={0}
                compact={false}
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
              <Trans>Your Points</Trans>
              <TextWithTooltip>
                <Trans>
                  The total points you have earned so far. You earn points by supplying, borrowing. And you get boosts in your points for staking ZERO tokens.
                </Trans>
              </TextWithTooltip>
            </div>
          }
          loading={userCurrentPoints.isLoading}
        >
          {userCurrentPoints.value.totalCurrentPoints ? (
            <Box display={'flex'} alignItems={'center'}>
              <FormattedNumber
                value={userCurrentPoints.value.totalCurrentPoints}
                variant={valueTypographyVariant}
                symbol={'Pts'}
                visibleDecimals={0}
                compact={false}
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
              <Trans>Your Staking Boost</Trans>
              <TextWithTooltip>
                <Trans>
                  The boost you get on your points for staking ZERO tokens. The more ZERO tokens you stake, the higher the boost. A max of 5x boost is earned for staking 50mn ZERO tokens (zLP and veZERO combined).
                </Trans>
              </TextWithTooltip>
            </div>
          }
          loading={userData.isLoading}
        >
          {userData.value.stakeBoost ? (
            <Box display={'flex'} alignItems={'center'}>
              <FormattedNumber
                value={userData.value.stakeBoost.toFixed(3)}
                variant={valueTypographyVariant}
                sx={{ color: 'lightgreen' }}
                visibleDecimals={3}
                symbol={'x'}
                compact={false}
                symbolsColor="lightgreen"
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
              <Trans>Total Points Distributed</Trans>
              <TextWithTooltip>
                <Trans>
                  How many points have been distributed in total so far. This is the total number of points that have been earned by all users combined. Your rewards are distributed based on this number as a percentage.
                </Trans>
              </TextWithTooltip>
            </div>
          }
          loading={globalPoints.isLoading}
        >
          {globalPoints.value.totalPoints ? (
            <Box display={'flex'} alignItems={'center'}>
              <FormattedNumber
                value={globalPoints.value.totalPoints}
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
        <TopInfoPanelItem
          hideIcon
          title={
            <div style={{ display: 'flex' }}>
              <Trans>Total Participants</Trans>
              <TextWithTooltip>
                <Trans>
                  How many users have participated in the ZERO Gravity program so far. This is the total number of users who have earned points.
                </Trans>
              </TextWithTooltip>
            </div>
          }
          loading={globalPoints.isLoading}
        >
          {globalPoints.value.totalUsers ? (
            <Box display={'flex'} alignItems={'center'}>
              <FormattedNumber
                value={globalPoints.value.totalUsers}
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
      </TopInfoPanel>
    </>
  );
};
