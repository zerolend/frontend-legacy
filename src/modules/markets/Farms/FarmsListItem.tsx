import { Trans } from '@lingui/macro';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { IncentivesCard } from '../../../components/incentives/IncentivesCard';
import { ListColumn } from '../../../components/lists/ListColumn';
import { ListItem } from '../../../components/lists/ListItem';
import { Link } from '../../../components/primitives/Link';
import { TokenIcon } from '../../../components/primitives/TokenIcon';
import { TypeFarmConfig } from '../../../ui-config/farmConfig';
import useGetFarmingApr from '../../../hooks/farms/useGetFarmingApr';

interface IProps {
  data: TypeFarmConfig;
}
export const FarmsListItem = (props: IProps) => {
  const farmApr = useGetFarmingApr(props.data);
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down('md'));

  return (
    <ListItem
      px={6}
      minHeight={76}
      onClick={() => {
        window.open(props.data.farmLink);
      }}
      sx={{ cursor: 'pointer' }}
      button
      data-cy={`marketListItemListItem_${props.data.farmIcon}`}
    >
      <ListColumn isRow maxWidth={280}>
        <TokenIcon symbol={props.data.farmIcon} fontSize="large" />
        <Box sx={{ pl: 3.5, overflow: 'hidden' }}>
          <Typography variant="h4" noWrap>
            {props.data.name}
          </Typography>
          <Box
            sx={{
              p: { xs: '0', xsm: '3.625px 0px' },
            }}
          >
            <Typography variant="subheader2" color="text.muted" noWrap>
              {props.data.farmIcon}
            </Typography>
          </Box>
        </Box>
      </ListColumn>

      <ListColumn>
        <Typography variant="h4" noWrap>
          {props.data.platform}
        </Typography>
      </ListColumn>

      <ListColumn>
        {props.data.rewardTokens.map((reward) => {
          return (
            <Typography variant="h4" noWrap key={reward}>
              {reward}
            </Typography>
          );
        })}
      </ListColumn>

      <ListColumn>
        <IncentivesCard
          value={farmApr.value}
          incentives={[]}
          symbol={'KNC_USDC_USDT'}
          variant="main16"
          symbolsVariant="secondary16"
        />
      </ListColumn>

      {!md && (
        <ListColumn minWidth={95} maxWidth={95} align="right">
          <Button variant="outlined" component={Link} href={props.data.farmLink}>
            <Trans>Details</Trans>
          </Button>
        </ListColumn>
      )}
    </ListItem>
  );
};
