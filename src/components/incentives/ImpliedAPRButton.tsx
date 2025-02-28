import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';

import { ContentWithTooltip } from '../ContentWithTooltip';
import { FormattedNumber } from '../primitives/FormattedNumber';
import { ImpliedAprsConfig } from '../../ui-config/impliedAprsConfig';
import { ComputedReserveData } from '../../hooks/app-data-provider/useAppDataProvider';
import { IImpliedApr } from '../../hooks/useGetImpliedApr';
import { MarketDataType } from '../../ui-config/marketsConfig';

interface IncentivesAPRButtonProps {
  reserve: ComputedReserveData;
  impliedApr: IImpliedApr;
  currentMarketData: MarketDataType;
}

export const IncentivesAPRButton = ({
  reserve,
  impliedApr,
  currentMarketData,
}: IncentivesAPRButtonProps) => {
  const [open, setOpen] = useState(false);

  const isFixed = reserve.symbol.startsWith('PT');

  const incentives = impliedApr?.data
    ? Number(
        impliedApr?.data[currentMarketData.chainId.toString()]
          ? impliedApr?.data[currentMarketData.chainId.toString()][reserve.symbol] || 0
          : 0
      )
    : 0;

  const toolTip = ImpliedAprsConfig[currentMarketData.chainId]
    ? ImpliedAprsConfig[currentMarketData.chainId]
      ? ImpliedAprsConfig[currentMarketData.chainId][reserve.symbol]
        ? ImpliedAprsConfig[currentMarketData.chainId][reserve.symbol].toolTip || ''
        : ''
      : ''
    : '';

  if (incentives === 0) return <></>;

  const incentivesButtonValue = () => {
    return (
      <Box display={'flex'} alignItems="center">
        <Typography variant="secondary12" color="text.secondary">
          {isFixed && 'Fixed '}APR:&nbsp;
        </Typography>
        <FormattedNumber value={incentives} percent variant="main12" color="text.secondary" />
      </Box>
    );
  };

  return (
    <ContentWithTooltip
      placement="bottom"
      tooltipContent={toolTip || ''}
      withoutHover
      setOpen={setOpen}
      open={open}
    >
      <Box
        sx={(theme) => ({
          p: { xs: '0 4px', xsm: '2px 4px' },
          border: `1px solid ${open ? theme.palette.action.disabled : theme.palette.divider}`,
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 0.2s ease',
          bgcolor: open ? 'action.hover' : 'transparent',
          '&:hover': {
            bgcolor: 'action.hover',
            borderColor: 'action.disabled',
          },
        })}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Box /*sx={{ mr: 2 }}*/>{incentivesButtonValue()}</Box>
        <Box sx={{ display: 'inline-flex' }}></Box>
      </Box>
    </ContentWithTooltip>
  );
};
