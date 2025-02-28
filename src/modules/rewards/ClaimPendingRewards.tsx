import { ListWrapper } from 'src/components/lists/ListWrapper';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import { normalize, UserIncentiveData } from '@aave/math-utils';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import * as React from 'react';
import { useModalContext } from '../../hooks/useModal';
import { useAppDataContext } from '../../hooks/app-data-provider/useAppDataProvider';
import { TokenIcon } from '../../components/primitives/TokenIcon';
import { NoData } from '../../components/primitives/NoData';
import useGetEarnedValue from 'src/hooks/omnistaking/useGetEarnedValue';
import { zeroConfig } from 'src/ui-config/zeroConfig';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import useGetLPEarnedValue from 'src/hooks/omnistaking/useGetLPEarnedValue';

const ClaimPendingRewards = () => {
  const { openClaimRewards, openZEROLockerIncentives, openLPLockerIncentives } = useModalContext();
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, reserves } = useAppDataContext();
  const earned = useGetEarnedValue();
  const { currentChainId, currentMarketData, currentNetworkConfig } = useProtocolDataContext();

  const { claimableRewardsUsd } = Object.entries(user.calculatedUserIncentives)
    .filter(([, data]) =>
      currentMarketData.whiteListedIncentives.includes(data.rewardTokenSymbol.toLowerCase())
    )
    .reduce(
      (acc, [rewardTokenAddress]) => {
        const incentive: UserIncentiveData = user.calculatedUserIncentives[rewardTokenAddress];
        const rewardBalance = normalize(incentive.claimableRewards, incentive.rewardTokenDecimals);

        let tokenPrice = 0;
        // getting price from reserves for the native rewards for v2 markets
        if (!currentMarketData.v3 && Number(rewardBalance) > 0) {
          reserves.forEach((reserve) => {
            if (reserve.symbol === currentNetworkConfig.wrappedBaseAssetSymbol) {
              tokenPrice = Number(reserve.priceInUSD);
            }
          });
        } else {
          tokenPrice = Number(incentive.rewardPriceFeed);
        }

        const rewardBalanceUsd = Number(rewardBalance) * tokenPrice;

        if (rewardBalanceUsd > 0) {
          if (acc.assets.indexOf(incentive.rewardTokenSymbol) === -1) {
            acc.assets.push(incentive.rewardTokenSymbol);
          }

          acc.claimableRewardsUsd += Number(rewardBalanceUsd);
        }

        return acc;
      },
      { claimableRewardsUsd: 0, assets: [] } as { claimableRewardsUsd: number; assets: string[] }
    );

  const lpRewardEarned = useGetLPEarnedValue();

  return (
    <Box position={'relative'} overflow={'hidden'} mb={6}>
      <ListWrapper
        titleComponent={
          <Box>
            <Typography component="p" variant="h3" sx={{ mr: 4 }}>
              <Trans>Earned Rewards</Trans>
            </Typography>
            <Typography component="p" variant="description" sx={{ mr: 4 }} color={'text.muted'}>
              <Trans>
                Here you can see the different rewards you have received for staking or providing
                liquidity via lending / borrowing.
              </Trans>
            </Typography>
          </Box>
        }
        localStorageName={'claimPendingRewards'}
      >
        <Box sx={downToSM ? { px: 4, pb: 6 } : { px: 6, pb: 6 }}>
          <Box
            display={'flex'}
            alignItems={'flex-start'}
            justifyContent={'space-between'}
            borderBottom={'1px solid lightGray'}
            pb={4}
            mb={4}
          >
            <Box>
              <Typography variant={'h4'}>Lending / borrowing rewards</Typography>
              <Typography variant={'caption'} color={'text.muted'}>
                Incentives earned from supplying / borrowing on lending markets.
              </Typography>
            </Box>
            <Box textAlign={'right'} ml={4}>
              {claimableRewardsUsd ? (
                <FormattedNumber
                  value={claimableRewardsUsd}
                  variant={'h3'}
                  visibleDecimals={2}
                  compact={true}
                  symbol={'USD'}
                  symbolsColor="#A5A8B6"
                  symbolsVariant={'h4'}
                  data-cy={'Claim_Value'}
                  sx={{ display: 'flex', alignItems: 'baseline' }}
                />
              ) : (
                <NoData />
              )}
              <Button
                variant="contained"
                onClick={() => openClaimRewards()}
                size={'small'}
              // disabled={!zeroConfig.crossChainAddresses[currentChainId]}
              >
                Claim
              </Button>
            </Box>
          </Box>
          {
            zeroConfig.crossChainAddresses[currentChainId] && zeroConfig.crossChainAddresses[currentChainId].OMNI_STAKING && (
              <Box
                display={'flex'}
                alignItems={'flex-start'}
                justifyContent={'space-between'}
                borderBottom={'1px solid lightGray'}
                pb={4}
                mb={4}
              >
                <Box>
                  <Typography variant={'h4'}>Staking rewards (Emissions)</Typography>
                  <Typography variant={'caption'} color={'text.muted'}>
                    Incentives earned from staking ZERO.
                  </Typography>
                </Box>
                <Box textAlign={'right'} ml={4}>
                  {earned ? (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
                      <FormattedNumber
                        value={normalize(earned, 18)}
                        variant={'h3'}
                        visibleDecimals={2}
                        compact={true}
                        symbolsColor="#A5A8B6"
                        symbolsVariant={'h4'}
                        data-cy={'Claim_Value'}
                        sx={{ display: 'flex', alignItems: 'baseline' }}
                      />
                      <TokenIcon symbol={'ZERO'} sx={{ width: 18, height: 18, ml: 1 }} />
                    </Box>
                  ) : (
                    <NoData />
                  )}
                  <Button
                    variant="contained"
                    onClick={() => openZEROLockerIncentives(earned.toString())}
                    size={'small'}
                  >
                    Claim
                  </Button>
                </Box>
              </Box>
            )
          }
          {
            zeroConfig.crossChainAddresses[currentChainId] && zeroConfig.crossChainAddresses[currentChainId].OMNI_STAKING_LP && (
              <Box
                display={'flex'}
                alignItems={'flex-start'}
                justifyContent={'space-between'}
              // borderBottom={'1px solid lightGray'}
              // pb={4}
              // mb={4}
              >
                <Box>
                  <Typography variant={'h4'}>Staking rewards (Revenue)</Typography>
                  <Typography variant={'caption'} color={'text.muted'}>
                    Protocol revenue will be distributed to LP stakers in the form of ETH.
                  </Typography>
                </Box>
                <Box textAlign={'right'} ml={4}>
                  {lpRewardEarned ? (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
                      <FormattedNumber
                        value={normalize(lpRewardEarned, 18)}
                        variant={'h3'}
                        visibleDecimals={2}
                        compact={true}
                        symbolsColor="#A5A8B6"
                        symbolsVariant={'h4'}
                        data-cy={'Claim_Value'}
                        sx={{ display: 'flex', alignItems: 'baseline' }}
                      />
                      <TokenIcon symbol={'ETH'} sx={{ width: 18, height: 18, ml: 1 }} />
                    </Box>
                  ) : (
                    <NoData />
                  )}

                  <Button
                    variant="contained"
                    onClick={() => openLPLockerIncentives(lpRewardEarned.toString())}
                    size={'small'}
                    disabled={!zeroConfig.crossChainAddresses[currentChainId]}
                  >
                    Claim
                  </Button>
                </Box>
              </Box>
            )
          }
        </Box>
      </ListWrapper>
    </Box>
  );
};

export default ClaimPendingRewards;
