import React from 'react';
import LockRow from './LockRow';
import useGetAllLocks from 'src/hooks/lock/useGetAllLocks';
import { ListWrapper } from '../../components/lists/ListWrapper';
import { Box, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';

const LockList = () => {
  const { data: LockResult, isFetching: lockFetching } = useGetAllLocks();

  return (
    <>
      {LockResult?.length === 0 || LockResult === undefined ? (
        <ListWrapper
          titleComponent={
            <Box>
              <Typography component="p" variant="h3" sx={{ mr: 4 }}>
                <Trans>Your Token Locks</Trans>
              </Typography>
              <Typography component="p" variant="description" sx={{ mr: 4 }} color={'text.muted'}>
                <Trans>
                  Your staking positions will be visible as NFTs here. You can withdraw your staked
                  tokens after the lock period is over.
                </Trans>
              </Typography>
            </Box>
          }
        >
          <Box px={6}>
            <Box mb={4} pb={4}>
              <Typography textAlign={'center'}>
                {lockFetching ? `Fetching Locks...` : `No locks found`}
              </Typography>
            </Box>
          </Box>
        </ListWrapper>
      ) : (
        LockResult?.map((lock, index) => {
          return <LockRow kind='token' key={index} lock={lock} icon="ZERO" />;
        })
      )}
    </>
  );
};

export default LockList;
