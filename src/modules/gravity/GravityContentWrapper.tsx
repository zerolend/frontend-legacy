import { Box } from '@mui/system';
import { Grid, Typography } from '@mui/material';
import PointsCard from './components/PointsCard';
import Leaderboard from './Leaderboard';
import ReferNEarn from './ReferNEarn';
import { IGravityPublicUserData } from '../../hooks/gravity/useGetGravityPublicUserData';
import { IUsersCurrentPointsData } from '../../hooks/gravity/useGetUsersCurrentPointsData';
import { Warning } from '../../components/primitives/Warning';
import React from 'react';

interface IProps {
  userData: IGravityPublicUserData;
  userCurrentPoints: IUsersCurrentPointsData;
  serverDown?: number;
  currentSeason: { loading: boolean; value: number };
}

const GravityContentWrapper = (props: IProps) => {
  const { userData, userCurrentPoints, currentSeason } = props;

  if (props.serverDown !== 200) {
    return (
      <Box>
        <Warning severity="warning" icon={false}>
          <Typography variant="description" sx={{ mr: 2 }}>
            We our upgrading our server. Please try again in sometime.
          </Typography>
        </Warning>
      </Box>
    );
  }

  if (!currentSeason.loading && currentSeason.value === 3) {
    return (
      <Box>
        <a
          href={'https://one.zerolend.xyz/gravity'}
          target={'_self'}
          style={{ textDecoration: 'none' }}
        >
          <Warning severity="warning" icon={false}>
            <Typography variant="description" sx={{ mr: 2 }}>
              <b>Chapter 2 has ended and Chapter 3 🚀 is now live.</b> {' '}
              Click{' '}
              <a href={'https://one.zerolend.xyz/gravity'} target={'_self'}>
                here
              </a>{' '}
              to view the Chapter 3 points.
              <br />
              Claiming of Chapter 2 rewards will start soon
            </Typography>
          </Warning>
        </a>
      </Box>
    );
  }

  if (!userData.isLoading && !userData.success && userData?.error === 'user not found') {
    return (
      <Box>
        <Warning severity="warning" icon={false}>
          <Typography variant="description" sx={{ mr: 2 }}>
            Your wallet is currently not being tracked on the Gravity Program. To get your wallet
            tracked, simply supply or borrow any asset across any market.
          </Typography>
        </Warning>
        <Leaderboard
          userCurrentPoints={userCurrentPoints}
          userData={userData}
          currentSeason={currentSeason}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={2} mb={4}>
        <Grid item md={12}>
          <ReferNEarn />
        </Grid>
        <Grid item md={4}>
          <PointsCard
            title={'Staking Boost 🚀'}
            description={
              'You can get upto a 5x overall boost on your points by staking ZERO tokens.'
            }
            textHint="Holding upto 50mn veZERO gets the max boost."
            value={userData.value.stakeBoost}
            textValue={`${userData?.value?.stakeBoost?.toFixed(3)}x`}
            valueLoading={userData.isLoading}
          />
        </Grid>
        <Grid item md={4}>
          <PointsCard
            title={'Supply Points'}
            description={'You get upto 15x points per day for every USD worth of tokens supplied.'}
            value={userCurrentPoints.value.totalCurrentSupplyPoints}
            valueLoading={userCurrentPoints.isLoading}
            rate={userCurrentPoints.value.totalCurrentSupplyPointsPerSec}
          />
        </Grid>
        <Grid item md={4}>
          <PointsCard
            title={'Borrow Points'}
            description={'You get upto 20x points per day for every USD worth of tokens borrowed.'}
            value={userCurrentPoints.value.totalCurrentBorrowPoints}
            valueLoading={userCurrentPoints.isLoading}
            rate={userCurrentPoints.value.totalCurrentBorrowPointsPerSec}
          />
        </Grid>
      </Grid>
      <Leaderboard
        userCurrentPoints={userCurrentPoints}
        userData={userData}
        currentSeason={currentSeason}
      />
    </Box>
  );
};

export default GravityContentWrapper;
