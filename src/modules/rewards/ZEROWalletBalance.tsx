import { ListWrapper } from 'src/components/lists/ListWrapper';
import { Box, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import { normalizeBN } from '@aave/math-utils';
import { useAppDataContext } from '../../hooks/app-data-provider/useAppDataProvider';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import * as React from 'react';
import useGetTokenBalance from '../../hooks/tokens/useGetTokenBalance';
import { useRootStore } from '../../store/root';
import { TokenIcon } from '../../components/primitives/TokenIcon';
import { useProtocolDataContext } from '../../hooks/useProtocolDataContext';

const ZEROWalletBalance = () => {
  const { loading } = useAppDataContext();
  const { currentMarketData } = useProtocolDataContext();

  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const usdValue = useRootStore((store) => store.oraclePrice);
  const zeroBal = useGetTokenBalance(
    currentMarketData.addresses?.ZERO_ADDRESS?.toLowerCase() || ''
  );

  if (currentMarketData.addresses?.ZERO_ADDRESS?.toLowerCase() === undefined) return <div />;

  const amountInUsd =
    usdValue && ((usdValue / 1e8) * Number(normalizeBN(zeroBal.toString(), 18))).toString();

  return (
    <Box position={'relative'} overflow={'hidden'} mb={6}>
      <ListWrapper
        titleComponent={
          <Box>
            <Typography component="div" variant="h3" sx={{ mr: 4 }}>
              <Trans>ZERO Wallet Balance</Trans>
            </Typography>
            <Typography variant="description" sx={{ mr: 4 }}>
              <Trans>Shows how much ZERO tokens you currently have in your wallet</Trans>
            </Typography>
          </Box>
        }
      >
        <Box sx={downToSM ? { px: 4, pb: 6 } : { px: 6, pb: 6 }}>
          <Box>
            {loading ? (
              <Skeleton width={60} height={downToSM ? 28 : 24} sx={{ background: '#27264C' }} />
            ) : (
              <Box>
                <Box pb={2} mb={2}>
                  <Box display={'flex'} alignItems={'center'}>
                    <TokenIcon symbol={'zero'} fontSize={'medium'} sx={{ mr: 1 }} />
                    <FormattedNumber
                      value={normalizeBN(zeroBal.toString(), 18).toString()}
                      variant={'h1'}
                      visibleDecimals={2}
                      compact={true}
                      symbolsColor="#A5A8B6"
                      symbolsVariant={'display1'}
                      data-cy={'Claim_Value'}
                      sx={{ display: 'flex', alignItems: 'baseline' }}
                    />
                  </Box>
                  <FormattedNumber
                    value={amountInUsd}
                    variant={'h4'}
                    visibleDecimals={2}
                    symbol={'USD'}
                    compact={true}
                    symbolsColor="#A5A8B6"
                    symbolsVariant={'h4'}
                    data-cy={'Claim_Value'}
                    sx={{ display: 'flex', alignItems: 'baseline' }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </ListWrapper>
    </Box>
  );
};

export default ZEROWalletBalance;
