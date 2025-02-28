import { Trans } from '@lingui/macro';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';
import { PageTitle } from 'src/components/TopInfoPanel/PageTitle';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import { TokenIcon } from '../../components/primitives/TokenIcon';
import { ChainAvailabilityText } from '../../components/ChainAvailabilityText';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { NoData } from '../../components/primitives/NoData';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import useGetTotalVotingPower from '../../hooks/omnistaking/useGetTotalVotingPower';
import { TextWithTooltip } from '../../components/TextWithTooltip';

export const LockTopPanel = () => {
  const { currentNetworkConfig } = useProtocolDataContext();
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';
  const noDataTypographyVariant = downToSM ? 'secondary16' : 'secondary21';

  const { value: data, loading } = useGetTotalVotingPower();

  return (
    <>
      <TopInfoPanel
        titleComponent={
          <>
            <ChainAvailabilityText wrapperSx={{ mb: 4 }} chainId={59144} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TokenIcon symbol={'zero'} fontSize={'large'} sx={{ mb: 4, mr: 2 }} />
              <PageTitle
                pageTitle={<Trans>Stake</Trans>}
                withMarketSwitcher={false}
                bridge={currentNetworkConfig.bridge}
              />
            </Box>
          </>
        }
        pageDesc={
          <Trans>
            Here you can stake ZERO for veZERO and enjoy staking benefits and future potential
            airdrops.
          </Trans>
        }
      >
        <TopInfoPanelItem
          hideIcon
          title={
            <div style={{ display: 'flex' }}>
              <Trans>Your total staked share</Trans>
              <TextWithTooltip>
                <Trans>
                  How much staked ZERO you hold as a percentage of the total staked ZERO and total staked LP (zLP). This percentage is used
                  to calculate your share of airdrops, rewards and voting power. Your staking boost is also calculated based on this percentage.
                </Trans>
              </TextWithTooltip>
            </div>
          }
          loading={loading}
        >
          {data.totalStakedPerc ? (
            <Box display={'flex'} alignItems={'center'}>
              <FormattedNumber
                value={data.totalStakedPerc}
                variant={valueTypographyVariant}
                visibleDecimals={2}
                compact
                percent
                symbolsColor="#A5A8B6"
                symbolsVariant={symbolsVariant}
              />
            </Box>
          ) : (
            <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
          )}
        </TopInfoPanelItem>
        <TopInfoPanelItem
          hideIcon
          title={
            <div style={{ display: 'flex' }}>
              <Trans>Your ZERO staked share</Trans>
              <TextWithTooltip>
                <Trans>
                  How much staked ZERO you hold as a percentage of total staked ZERO only.
                </Trans>
              </TextWithTooltip>
            </div>
          }
          loading={loading}
        >
          {data.zeroStakedPerc ? (
            <Box display={'flex'} alignItems={'center'}>
              <FormattedNumber
                value={data.zeroStakedPerc}
                variant={valueTypographyVariant}
                visibleDecimals={2}
                compact
                percent
                symbolsColor="#A5A8B6"
                symbolsVariant={symbolsVariant}
              />
            </Box>
          ) : (
            <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
          )}
        </TopInfoPanelItem>
        <TopInfoPanelItem
          hideIcon
          title={
            <div style={{ display: 'flex' }}>
              <Trans>Your zLP staked share</Trans>
              <TextWithTooltip>
                <Trans>
                  How much staked LP (zLP) you hold as a percentage of total staked LP (zLP) only.
                </Trans>
              </TextWithTooltip>
            </div>
          }
          loading={loading}
        >
          {data.lpStakedPerc ? (
            <Box display={'flex'} alignItems={'center'}>
              <FormattedNumber
                value={data.lpStakedPerc}
                variant={valueTypographyVariant}
                visibleDecimals={2}
                compact
                percent
                symbolsColor="#A5A8B6"
                symbolsVariant={symbolsVariant}
              />
            </Box>
          ) : (
            <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
          )}
        </TopInfoPanelItem>
      </TopInfoPanel>
    </>
  );
};
