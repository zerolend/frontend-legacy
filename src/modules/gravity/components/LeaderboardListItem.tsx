import { ListItem } from '../../../components/lists/ListItem';
import { ListColumn } from '../../../components/lists/ListColumn';
import { UserNameText } from '../../../components/UserNameText';
import { FormattedNumber } from '../../../components/primitives/FormattedNumber';
import { ILeaderBoard } from '../../../hooks/gravity/useGetGravityLeaderBoard';
import { Link, SvgIcon, Typography, useMediaQuery } from '@mui/material';
import { ExternalLinkIcon } from '@heroicons/react/solid';

interface LeaderboardListItemProps extends ILeaderBoard {
  rank: number;
  isMe?: boolean;
}

const LeaderboardListItem = (props: LeaderboardListItemProps) => {
  const isTableChangedToCards = useMediaQuery('(max-width:1125px)');

  return (
    <ListItem px={6} minHeight={54} button data-cy={`LeaderboardListItem_${props.address}`} sx={props.isMe? {background: '#EFE8FE80'}: {}}>
      <ListColumn isRow maxWidth={120}>
        <FormattedNumber compact={false} value={props.rank} variant="main16" visibleDecimals={0} />
      </ListColumn>
      {props.isMe ? (
        <ListColumn isRow maxWidth={280}>
          <Typography variant="h4" noWrap>
            You
          </Typography>
          <Link
            href={`https://debank.com/profile/${props.address}`}
            target="_blank"
            sx={{ display: 'flex' }}
          >
            <SvgIcon sx={{ fontSize: 16 }}>
              <ExternalLinkIcon />
            </SvgIcon>
          </Link>
        </ListColumn>
      ) : (
        <ListColumn isRow maxWidth={280}>
          <UserNameText
            address={props.address}
            link={`https://debank.com/profile/${props.address}`}
            darkTooltip={'View on debank'}
            variant={'h4'}
          />
        </ListColumn>
      )}
      {!isTableChangedToCards && (
        <ListColumn>
          <FormattedNumber
            compact={false}
            value={props.stakeBoost}
            variant="main16"
            visibleDecimals={3}
            symbol={'x'}
          />
        </ListColumn>
      )}
      {!isTableChangedToCards && (
        <ListColumn>
          <FormattedNumber
            compact={false}
            value={props.totalSupplyPoints}
            variant="main16"
            visibleDecimals={0}
          />
        </ListColumn>
      )}
      {!isTableChangedToCards && (
        <ListColumn>
          <FormattedNumber
            compact={false}
            value={props.totalBorrowPoints}
            variant="main16"
            visibleDecimals={0}
          />
        </ListColumn>
      )}
      <ListColumn>
        <FormattedNumber
          compact={false}
          value={props.totalPoints}
          variant="main16"
          visibleDecimals={0}
        />
      </ListColumn>
    </ListItem>
  );
};

export default LeaderboardListItem;
