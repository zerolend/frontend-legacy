import { ReserveIncentiveResponse } from '@aave/math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives';
import { Box } from '@mui/material';
import { ReactNode } from 'react';

import { FormattedNumber } from '../primitives/FormattedNumber';
import { NoData } from '../primitives/NoData';
import { IncentivesButton } from './IncentivesButton';
import PointsIncentivesCard from './PointsIncentivesCard';
import { apyConfig } from '../../ui-config/apyConfig';
import { useProtocolDataContext } from '../../hooks/useProtocolDataContext';
import { TextWithTooltip } from '../TextWithTooltip';

interface IncentivesCardProps {
  symbol: string;
  value: string | number;
  incentives?: ReserveIncentiveResponse[];
  variant?: 'main14' | 'main16' | 'secondary14';
  symbolsVariant?: 'secondary14' | 'secondary16';
  align?: 'center' | 'flex-end';
  color?: string;
  tooltip?: ReactNode;
  isSupplyApy?: boolean;
}

export const IncentivesCard = ({
  symbol,
  value,
  incentives,
  variant = 'secondary14',
  symbolsVariant,
  align,
  color,
  tooltip,
  isSupplyApy,
}: IncentivesCardProps) => {
  const { currentMarketData } = useProtocolDataContext();

  const overRidetoolTip: ReactNode =
    tooltip || apyConfig[`${symbol}-${currentMarketData.chainId}`]?.content
      ? apyConfig[`${symbol}-${currentMarketData.chainId}`]?.content
      : undefined;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align || { xs: 'flex-end', xsm: 'center' },
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      {value.toString() !== '-1' ? (
        value.toString() === '0' ? (
          <div />
        ) : (
          <Box sx={{ display: 'flex' }}>
            <FormattedNumber
              data-cy={`apy`}
              value={value}
              percent
              variant={variant}
              symbolsVariant={symbolsVariant}
              color={color}
              symbolsColor={color}
            />
            {overRidetoolTip !== undefined && isSupplyApy && (
              <TextWithTooltip>{overRidetoolTip}</TextWithTooltip>
            )}
          </Box>
        )
      ) : (
        <NoData variant={variant} color={color || 'text.secondary'} />
      )}

      <IncentivesButton incentives={incentives} symbol={symbol} />
      <PointsIncentivesCard
        showZeroIncentive={value.toString() !== '-1'}
        symbol={symbol}
        isSupply={isSupplyApy}
      />
    </Box>
  );
};
