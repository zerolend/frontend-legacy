import { ListWrapper } from 'src/components/lists/ListWrapper';
import { Box, Button, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import * as React from 'react';
import { useRootStore } from '../../store/root';
import { useModalContext } from '../../hooks/useModal';
import ConvertCountdown from '../../components/Countdown/ConvertCountdown';
import { convert_start_date } from '../../ui-config/marketsConfig';
import Countdown from 'react-countdown';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { normalize } from '@aave/math-utils';
import useGetUsersMerkleProof from '../../hooks/useGetUsersMerkleProof';

export interface EZeroMerkleProofDataType {
  address: string;
  totalAmount: string;
  proofs: string[];
}

export type GravityMerkleDataType = {
  data: {
    account: string;
    amount: string;
  };
  proofs: string[];
};

const ConvertToZERO = () => {
  const { openConvertEZeroModal } = useModalContext();
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [countDownDone, setCountDownDone] = React.useState(false);

  const isClaimed = useRootStore((store) => store.isClaimed);

  const { isLoading: merkleLoading, value: merkleData } = useGetUsersMerkleProof();

  if (isClaimed) return <div />;

  return (
    <Box position={'relative'} overflow={'hidden'} mb={6}>
      <ListWrapper
        titleComponent={
          <Box>
            <Typography component="p" variant="h3" sx={{ mr: 4 }}>
              <Trans>Airdrop Eligibility</Trans>
            </Typography>
            <Typography component="p" variant="description" sx={{ mr: 4 }} color={'text.muted'}>
              <Trans>
                All eligible users can claim ZERO for earlyZERO and ZERO points.
                <br />
                Tokens earned are vested with 40% unlock, 3 months cliff, followed by 3 months
                linear vesting.
              </Trans>
            </Typography>
          </Box>
        }
        localStorageName={'convertToZERO'}
      >
        <Box sx={downToSM ? { px: 4, pb: 4 } : { px: 6, pb: 4 }}>
          {!countDownDone && <ConvertCountdown title={'CLAIMING STARTS IN'} />}
          <Box display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'} mb={8}>
            <Box>
              <Typography variant={'h4'}>Claim ZERO</Typography>
              <Typography variant={'caption'} color={'text.muted'}>
                {`Users can claim their upfront tokens here and the rest of the tokens will be shown as a vest under the "Your Vests" section`}
              </Typography>
            </Box>
            <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
              {countDownDone ? (
                <Box textAlign={'right'}>
                  {merkleLoading ? (
                    <Skeleton width={60} height={24} sx={{ background: '#27264C' }} />
                  ) : (
                    <FormattedNumber
                      value={normalize(Number((merkleData && merkleData.totalAmount) || 0), 18)}
                      variant="h3"
                      symbol="ZERO"
                    />
                  )}
                </Box>
              ) : (
                <>
                  <Typography variant={'h4'} mr={2}>
                    ?{' '}
                  </Typography>
                  <Typography variant={'h4'} mr={2}>
                    ZERO
                  </Typography>
                </>
              )}
            </Box>
          </Box>
          {countDownDone ? (
            <Button
              variant="contained"
              disabled={
                merkleData === undefined || isClaimed || isClaimed === undefined || merkleLoading
              }
              onClick={() => {
                if (merkleData && isClaimed !== undefined)
                  openConvertEZeroModal(merkleData, isClaimed);
              }}
              fullWidth
            >
              {merkleLoading
                ? 'Fetching your ZERO allocation'
                : isClaimed
                  ? 'Already Claimed'
                  : merkleData === undefined
                    ? 'Sorry, you have not received ZERO'
                    : 'Claim'}
            </Button>
          ) : (
            <Countdown
              date={convert_start_date}
              renderer={() => {
                return (
                  <Button variant="contained" fullWidth disabled={true}>
                    Claim
                  </Button>
                );
              }}
              onComplete={() => setCountDownDone(true)}
            />
          )}
        </Box>
      </ListWrapper>
    </Box>
  );
};

export default ConvertToZERO;
