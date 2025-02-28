import { useEffect, useState } from 'react';
import { useRootStore } from 'src/store/root';

import { ContentContainer } from '../src/components/ContentContainer';
import { MainLayout } from '../src/layouts/MainLayout';
import { GravityTopPanel } from '../src/modules/gravity/GravityTopPanel';
import GravityContentWrapper from '../src/modules/gravity/GravityContentWrapper';
import useGetGravityPublicUserData from '../src/hooks/gravity/useGetGravityPublicUserData';
import useGetUsersCurrentPointsData from '../src/hooks/gravity/useGetUsersCurrentPointsData';
import { checkServer, getCurrentSeason } from '../src/utils/ServerApi';

export default function GravityPage() {
  const trackEvent = useRootStore((store) => store.trackEvent);
  const [currentSeason, setCurrentSeason] = useState<{ loading: boolean; value: number }>({
    loading: true,
    value: 0,
  });
  const userData = useGetGravityPublicUserData();
  const userCurrentPoints = useGetUsersCurrentPointsData();
  const [serverDown, setServerDown] = useState<number>(200);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Rewards',
    });
  }, [trackEvent]);

  useEffect(() => {
    checkServer()
      .then((_d) => {
        if (_d?.online) {
        } else {
          setServerDown(0);
        }
      })
      .catch(() => {
        setServerDown(0);
      });
  }, []);

  useEffect(() => {
    getCurrentSeason()
      .then((_d) => {
        if (_d?.data.season) {
          setCurrentSeason({
            loading: false,
            value: _d.data.season === 'jul-2024' ? 2 : 3
          });
          console.log('season', _d.data.season);
        } else {
          setServerDown(0);
        }
      })
      .catch(() => {
        setServerDown(0);
      });
  }, []);

  return (
    <>
      <GravityTopPanel
        userCurrentPoints={userCurrentPoints}
        userData={userData}
        currentSeason={currentSeason}
      />
      <ContentContainer>
        <GravityContentWrapper
          userData={userData}
          userCurrentPoints={userCurrentPoints}
          serverDown={serverDown}
          currentSeason={currentSeason}
        />
      </ContentContainer>
    </>
  );
}

GravityPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
