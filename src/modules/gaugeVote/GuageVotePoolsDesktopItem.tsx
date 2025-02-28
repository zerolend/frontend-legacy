import { ListItem } from '../../components/lists/ListItem';
import { Box, Slider, Typography } from '@mui/material';
import { ListColumn } from '../../components/lists/ListColumn';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { IGuageData } from './GaugeVotePoolList';
import { ReserveSubheader } from '../../components/ReserveSubheader';
import React from 'react';
import { normalize } from '@aave/math-utils';

interface IProps {
  gauge: IGuageData;
  setUserPoolData: (data: any, value: any) => void;
}

const GuageVotePoolsDesktopItem = (props: IProps) => {
  const { gauge, setUserPoolData } = props;

  return (
    <ListItem
      px={6}
      minHeight={76}
      sx={{ cursor: 'pointer' }}
      button
      data-cy={`GuageVotePoolsDesktopItem_${gauge.poolName.toUpperCase()}`}
    >
      <ListColumn isRow maxWidth={340}>
        {/*<TokenIcon symbol={reserve.iconSymbol} fontSize="large" />*/}
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="h4" noWrap>
            {gauge.poolName}
          </Typography>
          <Typography variant="caption" noWrap>
            {gauge.poolAddress}
          </Typography>
        </Box>
      </ListColumn>
      <ListColumn>
        <FormattedNumber value={'2131243'} compact variant="main16" symbol={'USD'} />
      </ListColumn>
      <ListColumn>
        <FormattedNumber
          value={normalize(gauge.overallVotes, 18)}
          variant="main16"
          symbol={'ZERO'}
        />
        {/*<ReserveSubheader value={reserve.totalLiquidityUSD} />*/}
      </ListColumn>
      <ListColumn>
        <FormattedNumber value={normalize(gauge.yourVotes, 18)} variant="main16" percent={true} />
        <ReserveSubheader value={'3413131'} />
      </ListColumn>
      <ListColumn minWidth={280}>
        <Box sx={{ width: 260 }} pt={4}>
          <Slider
            name={gauge.poolAddress}
            size="small"
            defaultValue={0}
            aria-label="Small"
            valueLabelDisplay="auto"
            onChange={(data, value) => setUserPoolData(data, value)}
          />
        </Box>
      </ListColumn>
    </ListItem>
  );
};

export default GuageVotePoolsDesktopItem;
