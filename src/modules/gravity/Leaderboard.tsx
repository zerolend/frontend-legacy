import React, { useMemo, useState } from 'react';
import { ListColumn } from '../../components/lists/ListColumn';
import { ListHeaderTitle } from '../../components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from '../../components/lists/ListHeaderWrapper';
import { Trans } from '@lingui/macro';
import { ListWrapper } from '../../components/lists/ListWrapper';
import { Typography, useMediaQuery } from '@mui/material';
import LeaderboardListItem from './components/LeaderboardListItem';
import { MarketAssetsListItemLoader } from '../markets/MarketAssetsListItemLoader';
import { IGravityPublicUserData } from '../../hooks/gravity/useGetGravityPublicUserData';
import { IUsersCurrentPointsData } from '../../hooks/gravity/useGetUsersCurrentPointsData';
import useGetGravityLeaderBoardSorted from '../../hooks/gravity/useGetGravityLeaderBoardSorted';

const listHeaders = [
  {
    title: <Trans>Rank</Trans>,
    sortKey: 'rank',
  },
  {
    title: <Trans>User</Trans>,
    sortKey: 'address',
  },
  {
    title: <Trans>Boost</Trans>,
    sortKey: 'stakeBoost',
  },
  {
    title: <Trans>Supply Points</Trans>,
    sortKey: 'totalSupplyPoints',
  },
  {
    title: <Trans>Borrow Points</Trans>,
    sortKey: 'totalBorrowPoints',
  },
  {
    title: <Trans>Total Points</Trans>,
    sortKey: 'totalPoints',
  },
];

const mobileListHeaders = [
  {
    title: <Trans>User</Trans>,
    sortKey: 'address',
  },
  {
    title: <Trans>Total Points</Trans>,
    sortKey: 'totalPoints',
  },
];

interface IProps {
  userData: IGravityPublicUserData;
  userCurrentPoints: IUsersCurrentPointsData;
  currentSeason: { loading: boolean; value: number };
}

const Leaderboard = (props: IProps) => {
  const { userData, userCurrentPoints } = props;
  const isTableChangedToCards = useMediaQuery('(max-width:1125px)');
  const [sortName, setSortName] = useState('');
  const [sortDesc, setSortDesc] = useState(false);
  const sortedData = useGetGravityLeaderBoardSorted();

  const screenHeader = isTableChangedToCards ? mobileListHeaders : listHeaders;

  const selectedSortedData = useMemo(() => {
    if (sortDesc) {
      return sortedData.value.byTotalPoints;
    } else {
      if (sortName === 'totalSupplyPoints') {
        return sortedData.value.bySupplyPoints;
      } else if (sortName === 'totalBorrowPoints') {
        return sortedData.value.byBorrowPoints;
      } else if (sortName === 'stakeBoost') {
        return sortedData.value.byStakeBoost;
      } else {
        return sortedData.value.byTotalPoints;
      }
    }
  }, [sortName, sortDesc, sortedData.value]);

  const filterMe = useMemo(() => {
    return selectedSortedData.filter((data) => data.address.toLowerCase() !== userData.value.address.toLowerCase());
  }, [selectedSortedData, userData.value.address]);

  const addMe = useMemo(() => {
    if (userData.value.address !== '' && !userCurrentPoints.isLoading && !userData.isLoading) {
      return [
        {
          address: userData.value.address,
          totalSupplyPoints: userCurrentPoints.value.totalCurrentSupplyPoints,
          totalBorrowPoints: userCurrentPoints.value.totalCurrentBorrowPoints,
          totalPoints: userCurrentPoints.value.totalCurrentPoints,
          totalStakePoints: userCurrentPoints.value.totalCurrentStakingPoints,
          stakeBoost: userData.value.stakeBoost,
        },
      ];
    } else {
      return [];
    }
  }, [userData.value, userCurrentPoints.value]);

  return (
    <ListWrapper
      titleComponent={
        <Typography component="div" variant="h3" sx={{ mr: 4 }}>
          {`Leaderboard 🏆`}
        </Typography>
      }
    >
      <ListHeaderWrapper px={6}>
        {screenHeader.map((col) => (
          <ListColumn
            isRow={col.sortKey === 'rank' || col.sortKey === 'address'}
            maxWidth={col.sortKey === 'address' ? 280 : col.sortKey === 'rank' ? 120 : undefined}
            key={col.sortKey}
          >
            <ListHeaderTitle
              sortName={sortName}
              sortDesc={sortDesc}
              setSortName={setSortName}
              setSortDesc={setSortDesc}
              sortKey={col.sortKey}
              source="Gravity Page"
            >
              {col.title}
            </ListHeaderTitle>
          </ListColumn>
        ))}
      </ListHeaderWrapper>
      {(userData.isLoading || userCurrentPoints.isLoading) ? (
        <MarketAssetsListItemLoader />
      ) : (
        addMe.map((_l, index) => {
          return <LeaderboardListItem {..._l} key={index} rank={userData.value.rank} isMe={true} />;
        })
      )}
      {sortedData.isLoading ? (
        <>
          <MarketAssetsListItemLoader />
          <MarketAssetsListItemLoader />
          <MarketAssetsListItemLoader />
          <MarketAssetsListItemLoader />
        </>
      ) : (
        filterMe.map((_l, index) => {
          return <LeaderboardListItem {..._l} key={index} rank={_l.rank} />;
        })
      )}
    </ListWrapper>
  );
};

export default Leaderboard;
