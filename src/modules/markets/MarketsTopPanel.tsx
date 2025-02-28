import { valueToBigNumber } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { marketContainerProps } from 'pages/index.page';
import * as React from 'react';

import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import { useAppDataContext } from '../../hooks/app-data-provider/useAppDataProvider';
import { TokenIcon } from '../../components/primitives/TokenIcon';
import { GENERAL } from '../../utils/mixPanelEvents';
import { ZBlastPoints } from '../../components/infoTooltips/ZBlastPoints';
import { ZBlastGoldPoints } from '../../components/infoTooltips/ZBlastGoldPoints';
import useGetProtocolPoints from '../../hooks/points/useGetProtocolPoints';
import { useProtocolDataContext } from '../../hooks/useProtocolDataContext';
import useGetReferralLXPPoints from 'src/hooks/useGetReferralLXPPoints';
import { ZLineaReferralPoints } from 'src/components/infoTooltips/ZLineaReferralPoints';

export const MarketsTopPanel = () => {
  const { reserves, loading } = useAppDataContext();
  const { currentMarketData } = useProtocolDataContext();

  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const points = useGetProtocolPoints();
  const referralPoints = useGetReferralLXPPoints();

  const aggregatedStats = reserves.reduce(
    (acc, reserve) => {
      return {
        totalLiquidity: acc.totalLiquidity.plus(reserve.totalLiquidityUSD),
        totalDebt: acc.totalDebt.plus(reserve.totalDebtUSD),
      };
    },
    {
      totalLiquidity: valueToBigNumber(0),
      totalDebt: valueToBigNumber(0),
    }
  );

  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';

  return (
    <TopInfoPanel
      containerProps={marketContainerProps}
      pageTitle={
        <Box display={'flex'} alignItems={'center'}>
          <TokenIcon symbol={'zero'} fontSize={'large'} sx={{ mr: 2 }} />
          <Trans>Welcome to ZeroLend 🚀</Trans>
        </Box>
      }
      pageDesc={
        <Trans>
          {currentMarketData.description ||
            'A powerful decentralized lending protocol. Lend/Borrow with high capital efficiency and low interest fees'}
        </Trans>
      }
      withMarketSwitcher={true}
      pageKey={'market'}
    >
      <TopInfoPanelItem hideIcon title={<Trans>Total market size</Trans>} loading={loading}>
        <FormattedNumber
          value={aggregatedStats.totalLiquidity.toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsColor="#A5A8B6"
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>
      <TopInfoPanelItem hideIcon title={<Trans>Total available</Trans>} loading={loading}>
        <FormattedNumber
          value={aggregatedStats.totalLiquidity.minus(aggregatedStats.totalDebt).toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsColor="#A5A8B6"
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>
      <TopInfoPanelItem hideIcon title={<Trans>Total borrows</Trans>} loading={loading}>
        <FormattedNumber
          value={aggregatedStats.totalDebt.toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsColor="#A5A8B6"
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>
      {currentMarketData.chainId === 59144 && (
        <TopInfoPanelItem
          hideIcon
          title={
            <div style={{ display: 'flex' }}>
              <Trans>Linea LXP-L Referral Points</Trans>
              <ZLineaReferralPoints
                event={{
                  eventName: GENERAL.TOOL_TIP,
                }}
              />
            </div>
          }
          loading={referralPoints.isLoading}
        >
          <FormattedNumber
            value={referralPoints.value}
            sx={{ color: '#00FFFF' }}
            symbol={'Pts'}
            variant={valueTypographyVariant}
            visibleDecimals={2}
            compact
            symbolsColor="#A5A8B6"
            symbolsVariant={symbolsVariant}
          />
        </TopInfoPanelItem>
      )}
      {currentMarketData.chainId === 81457 && (
        <TopInfoPanelItem
          hideIcon
          title={
            <div style={{ display: 'flex' }}>
              <Trans>Total BLAST Points</Trans>
              <ZBlastPoints
                event={{
                  eventName: GENERAL.TOOL_TIP,
                }}
              />
            </div>
          }
          loading={loading}
        >
          <Box display={'flex'} alignItems={'center'}>
            <TokenIcon symbol={'blast'} fontSize={'small'} sx={{ mr: 1 }} />
            <FormattedNumber
              value={points.value.totalBlastPoints.toString()}
              sx={{ color: '#FCFC03' }}
              variant={valueTypographyVariant}
              visibleDecimals={2}
              symbol={'Pts'}
              compact
              symbolsColor="#A5A8B6"
              symbolsVariant={symbolsVariant}
            />
          </Box>
        </TopInfoPanelItem>
      )}
      {currentMarketData.chainId === 81457 && (
        <TopInfoPanelItem
          hideIcon
          title={
            <div style={{ display: 'flex' }}>
              <Trans>Total BLAST GOLD Points</Trans>
              <ZBlastGoldPoints
                event={{
                  eventName: GENERAL.TOOL_TIP,
                }}
              />
            </div>
          }
          loading={loading}
        >
          <Box display={'flex'} alignItems={'center'}>
            <TokenIcon symbol={'blast'} fontSize={'small'} sx={{ mr: 1 }} />
            <FormattedNumber
              value={points.value.totalBlastGoldPoints.toString()}
              sx={{ color: '#FCFC03' }}
              variant={valueTypographyVariant}
              visibleDecimals={2}
              symbol={'Pts'}
              compact
              symbolsColor="#A5A8B6"
              symbolsVariant={symbolsVariant}
            />
          </Box>
        </TopInfoPanelItem>
      )}
    </TopInfoPanel>
  );
};
