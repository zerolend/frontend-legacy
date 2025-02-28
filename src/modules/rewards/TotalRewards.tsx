import { ListWrapper } from 'src/components/lists/ListWrapper';
import { Box, Button, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import { normalize, UserIncentiveData } from '@aave/math-utils';
import { ChainId } from '@aave/contract-helpers';
import { useAppDataContext } from '../../hooks/app-data-provider/useAppDataProvider';
import { useProtocolDataContext } from '../../hooks/useProtocolDataContext';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import * as React from 'react';
import { useModalContext } from '../../hooks/useModal';
import { useEffect, useState } from 'react';
import { Reward } from '../../helpers/types';
import EarlyZero from '../../../public/icons/tokens/earlyzero.svg';

const TotalRewards = () => {
  const { currentMarketData } = useProtocolDataContext();
  const { user, reserves, loading } = useAppDataContext();
  const { openClaimRewards } = useModalContext();
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [claimableUsd, setClaimableUsd] = useState('0');
  const [selectedRewardSymbol, setSelectedRewardSymbol] = useState<string>('all');
  const [allReward, setAllReward] = useState<Reward>();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [earlyZeroRewardData, setEarlyZeroRewardData] = useState<Reward | undefined>(undefined);

  // get all rewards
  useEffect(() => {
    const userIncentives: Reward[] = [];
    let totalClaimableUsd = Number(claimableUsd);
    const allAssets: string[] = [];
    Object.keys(user.calculatedUserIncentives).forEach((rewardTokenAddress) => {
      const incentive: UserIncentiveData = user.calculatedUserIncentives[rewardTokenAddress];
      const rewardBalance = normalize(incentive.claimableRewards, incentive.rewardTokenDecimals);

      let tokenPrice = 0;
      // getting price from reserves for the native rewards for v2 markets
      if (!currentMarketData.v3 && Number(rewardBalance) > 0) {
        if (currentMarketData.chainId === ChainId.mainnet) {
          const aave = reserves.find((reserve) => reserve.symbol === 'AAVE');
          tokenPrice = aave ? Number(aave.priceInUSD) : 0;
        } else {
          reserves.forEach((reserve) => {
            if (reserve.isWrappedBaseAsset) {
              tokenPrice = Number(reserve.priceInUSD);
            }
          });
        }
      } else {
        tokenPrice = Number(incentive.rewardPriceFeed);
      }

      const rewardBalanceUsd = Number(rewardBalance) * tokenPrice;

      if (rewardBalanceUsd > 0) {
        incentive.assets.forEach((asset) => {
          if (allAssets.indexOf(asset) === -1) {
            allAssets.push(asset);
          }
        });

        userIncentives.push({
          assets: incentive.assets,
          incentiveControllerAddress: incentive.incentiveControllerAddress,
          symbol: incentive.rewardTokenSymbol,
          balance: rewardBalance,
          balanceUsd: rewardBalanceUsd.toString(),
          rewardTokenAddress,
        });

        totalClaimableUsd = totalClaimableUsd + Number(rewardBalanceUsd);
      }
    });

    if (userIncentives.length === 1) {
      setSelectedRewardSymbol(userIncentives[0].symbol);
    } else if (userIncentives.length > 1 && !selectedReward) {
      const allRewards = {
        assets: allAssets,
        incentiveControllerAddress: userIncentives[0].incentiveControllerAddress,
        symbol: 'all',
        balance: '0',
        balanceUsd: totalClaimableUsd.toString(),
        rewardTokenAddress: '',
      };
      setSelectedRewardSymbol('all');
      setAllReward(allRewards);
    }

    setRewards(userIncentives);
    setClaimableUsd(totalClaimableUsd.toString());
    setEarlyZeroRewardData(userIncentives.filter((data) => data.symbol === 'ZERO')[0]);
  }, [user.calculatedUserIncentives]);

  const selectedReward =
    selectedRewardSymbol === 'all'
      ? allReward
      : rewards.find((r) => r.symbol === selectedRewardSymbol);

  return (
    <Box position={'relative'} overflow={'hidden'}>
      <ListWrapper
        titleComponent={
          <Box>
            <Typography component="div" variant="h3" sx={{ mr: 4 }}>
              <Trans>Pending Rewards</Trans>
            </Typography>
            <Typography variant="description" sx={{ mr: 4 }}>
              <Trans>How much rewards you have yet to claim?</Trans>
            </Typography>
          </Box>
        }
      >
        <Box sx={downToSM ? { px: 4, pb: 6 } : { px: 6, pb: 6 }}>
          <Box
            sx={{
              position: 'absolute',
              right: '46px',
              top: '70px',
              opacity: 0.05,
              borderRadius: '50%',
              overflow: 'hidden',
              transform: 'scale(1.8)',
            }}
          >
            <EarlyZero />
          </Box>
          <Box sx={{ mb: 6 }}>
            {loading ? (
              <Skeleton width={60} height={downToSM ? 28 : 24} sx={{ background: '#27264C' }} />
            ) : (
              <Box>
                <FormattedNumber
                  value={earlyZeroRewardData === undefined ? '0' : earlyZeroRewardData.balance}
                  variant={'h1'}
                  visibleDecimals={2}
                  symbol={' earlyZERO'}
                  compact={true}
                  symbolsColor="#A5A8B6"
                  symbolsVariant={'display1'}
                  data-cy={'Claim_Value'}
                  sx={{ display: 'flex', alignItems: 'baseline' }}
                />
                <FormattedNumber
                  value={earlyZeroRewardData === undefined ? '0' : earlyZeroRewardData.balanceUsd}
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
            )}
          </Box>
          <Button variant="contained" onClick={() => openClaimRewards()}>
            Claim earlyZERO Rewards
          </Button>
        </Box>
      </ListWrapper>
    </Box>
  );
};

export default TotalRewards;
