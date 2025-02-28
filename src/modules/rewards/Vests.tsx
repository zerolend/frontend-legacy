import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';
import VestRow from './VestRow';
import { Trans } from '@lingui/macro';
import { ListWrapper } from '../../components/lists/ListWrapper';
import { GetUserVestingData } from 'src/contract-helpers/types';
import { useProtocolDataContext } from '../../hooks/useProtocolDataContext';

export interface IVestsProps {
  vests: GetUserVestingData[];
  vestLoading: boolean;
}

const Vesting = (props: IVestsProps) => {
  const { vests, vestLoading } = props;
  const theme = useTheme();
  const downToMD = useMediaQuery(theme.breakpoints.down('md'));
  const { currentMarket } = useProtocolDataContext();

  const filteredVests = React.useMemo(() => {
    if (currentMarket === 'proto_linea_v3') {
      return vests.filter((vest) => {
        if (vest?.id) {
          if (vest.hasPenalty && Number(vest.pendingClaimed) > 0) return false;
          return true;
        }
        return false;
      });
    } else {
      return [];
    }
  }, [vests, currentMarket]);

  return (
    <Box position={'relative'} overflow={'hidden'} mt={downToMD ? 6 : 0}>
      {filteredVests.length === 0 ? (
        <ListWrapper
          titleComponent={
            <Box>
              <Typography component="p" variant="h3" sx={{ mr: 4 }}>
                <Trans>Your Vests</Trans>
              </Typography>
              <Typography component="p" variant="description" sx={{ mr: 4 }} color={'text.muted'}>
                <Trans>
                  You can view your vested tokens here. Vests are represented as NFTs and can be
                  sold on secondary marketplaces. You can stake your vested tokens before the
                  vesting period is over to enjoy staking benefits.
                  <br />{' '}
                  <b>
                    <i>Vests are visible only on linea main market</i>
                  </b>
                </Trans>
              </Typography>
            </Box>
          }
        >
          <Box px={6}>
            <Box mb={4} pb={4}>
              <Typography textAlign={'center'}>
                {vestLoading ? `Loading Vests...` : `No vests found`}
              </Typography>
            </Box>
          </Box>
        </ListWrapper>
      ) : (
        <Box>
          {filteredVests.map((vest, index) => (
            <VestRow key={index} vest={vest} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Vesting;
