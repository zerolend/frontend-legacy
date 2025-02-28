import { Box, useMediaQuery, useTheme } from '@mui/material';
import Vests from './Vests';
import ClaimPendingRewards from './ClaimPendingRewards';
import useGetAllVests from 'src/hooks/vesting/useGetAllVests';
import PotentialAirdrops from './PotentialAirdrops';
import ZEROWalletBalance from './ZEROWalletBalance';

export const RewardsContentWrapper = () => {
  const { breakpoints } = useTheme();
  const { data: allVests, isFetching: vestFetching } = useGetAllVests();

  const isDesktop = useMediaQuery(breakpoints.up('lg'));
  const paperWidth = isDesktop ? 'calc(50% - 8px)' : '100%';

  return (
    <Box>
      <Box
        sx={{
          display: isDesktop ? 'flex' : 'block',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ display: { xs: 'block', lg: 'block' }, width: paperWidth }}>
          <ZEROWalletBalance />
          <ClaimPendingRewards />
          <PotentialAirdrops />
        </Box>

        <Box sx={{ display: { xs: 'block', lg: 'block' }, width: paperWidth }}>
          <Vests vests={allVests ?? []} vestLoading={vestFetching} />
        </Box>
      </Box>
    </Box>
  );
};
