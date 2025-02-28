import { ReactNode, useEffect } from 'react';
import { useRootStore } from 'src/store/root';

import { MainLayout } from '../src/layouts/MainLayout';
import { Box, Container } from '@mui/material';
import { VotingTopPanel } from '../src/modules/gaugeVote/VotingTopPanel';
import ComingSoon from '../src/components/ComingSoon';

interface VoteContainerProps {
  children: ReactNode;
}

export const voteContainerProps = {
  sx: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    pb: '39px',
    px: {
      xs: 2,
      xsm: 5,
      sm: 12,
      md: 5,
      lg: 0,
      xl: '96px',
      xxl: 0,
    },
    maxWidth: {
      xs: 'unset',
      lg: '1240px',
      xl: 'unset',
      xxl: '1440px',
    },
  },
};

export const VoteContainer = ({ children }: VoteContainerProps) => {
  return <Container {...voteContainerProps}>{children}</Container>;
};

export default function EmissionVotingPage() {
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Lock',
    });
  }, [trackEvent]);

  return (
    <>
      <VotingTopPanel />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          mt: { xs: '-32px', lg: '-46px', xl: '-44px', xxl: '-48px' },
        }}
      >
        <VoteContainer>
          <ComingSoon />
        </VoteContainer>
      </Box>
    </>
  );
}

EmissionVotingPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
