import React from 'react';
import LockRow from './LockRow';
import { ListWrapper } from '../../components/lists/ListWrapper';
import { Box, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import useGetAllLPLocks from 'src/hooks/lock/useGetAllLPLock';

const LockLPList = () => {
  const { data: LockResult, isFetching: lockFetching } = useGetAllLPLocks();

  return (
    <>
      {LockResult?.length === 0 || LockResult === undefined ? (
        <ListWrapper
          titleComponent={
            <Box>
              <Typography component="p" variant="h3" sx={{ mr: 4 }}>
                <Trans>Your LP Locks</Trans>
              </Typography>
              <Typography component="p" variant="description" sx={{ mr: 4 }} color={'text.muted'}>
                <Trans>
                  Your staking positions will be visible as NFTs here. You can withdraw your staked
                  LP tokens after the lock period is over.
                </Trans>
              </Typography>
            </Box>
          }
        >
          <Box px={6}>
            <Box mb={4} pb={4}>
              <Typography textAlign={'center'}>
                {lockFetching ? `Fetching LP Locks...` : `No LP locks found`}
              </Typography>
            </Box>
          </Box>
        </ListWrapper>
      ) : (
        LockResult?.map((lock, index) => {
          return <LockRow kind="lp" key={index} lock={lock} icon="NYLE_WETH_ZERO" />;
        })
      )}
    </>
  );
};

export default LockLPList;
