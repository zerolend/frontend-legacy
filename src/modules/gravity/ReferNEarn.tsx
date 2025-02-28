import { Box, Paper, Skeleton, SvgIcon, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CheckIcon, DuplicateIcon } from '@heroicons/react/outline';
import Snackbar from '@mui/material/Snackbar';
import useGetGravityPublicUserData from '../../hooks/gravity/useGetGravityPublicUserData';

const ReferNEarn = () => {

  const [copy, setCopy] = useState<boolean>(false);
  const userData = useGetGravityPublicUserData();

  const theme = useTheme();
  const upToSM = useMediaQuery(theme.breakpoints.up('sm'));

  const handleSnackbarClose = () => {
    setCopy(false);
  };

  useEffect(() => {
    setTimeout(() => {
      if (copy) setCopy(false);
    }, 3000);
  }, [copy]);

  const handleCopy = async () => {
    setCopy(true);
    navigator.clipboard.writeText(
      `https://app.zerolend.xyz/?invite=${userData.value.referralCode[0]}`,
    );
  };


  return (
    <Paper sx={{ pt: 4 }}>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={copy}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={'Copied Referral Link'}
      />
      <Box px={6}>
        <Box mb={4} pb={4}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
            <Box>
              <Typography component="div" variant="h3" sx={{ mr: 4 }}>
                Refer and earn points
              </Typography>
              <Typography
                component="p"
                variant="description"
                sx={{ mr: 4 }}
                color={'text.muted'}
                maxWidth={780}
              >
                Invite friends, and as they engage, both of you earn 20% bonus points. These points
                turn into $ZERO tokens. Expand your circle and amplify your earnings!
              </Typography>
            </Box>
          </Box>
          {!userData.isLoading ? (
            userData.value.referralCode[0]
              ? <Box display="flex" alignItems="center" onClick={() => handleCopy()} sx={{ cursor: 'pointer' }}
                maxWidth={'max-content'}>
                <Typography component="div" variant="h2" sx={{ mr: 2 }}>
                  {userData.value.referralCode[0]}
                </Typography>
                <SvgIcon fontSize="small">{copy ? <CheckIcon /> : <DuplicateIcon />}</SvgIcon>
              </Box>
              : <Typography component="div" variant="h2" sx={{ mr: 2 }}> -
              </Typography>)
            :
            <Skeleton width={60} height={upToSM ? 28 : 24} sx={{ background: '#27264C' }} />
          }
        </Box>
      </Box>
    </Paper>
  );
};

export default ReferNEarn;
