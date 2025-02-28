import { TitleWithSearchBar } from '../../components/TitleWithSearchBar';
import { Trans } from '@lingui/macro';
import { ListWrapper } from '../../components/lists/ListWrapper';
import { useMediaQuery, useTheme } from '@mui/material';
import GaugeVotePoolList from './GaugeVotePoolList';

const GaugeVoteListContainer = () => {
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down('sm'));

  return (
    <ListWrapper
      titleComponent={
        <TitleWithSearchBar
          onSearchTermChange={console.log}
          title={
            <>
              <Trans>Pools Voting</Trans>
            </>
          }
          searchPlaceholder={sm ? 'Search pool' : 'Search pool name, address'}
        />
      }
    >
      <GaugeVotePoolList guages={[]} loading={false} />

      {/*{!loading && filteredData.length === 0 && !displayGho && (
        <NoSearchResults
          searchTerm={searchTerm}
          subtitle={
            <Trans>
              We couldn&apos;t find any assets related to your search. Try again with a different
              asset name, symbol, or address.
            </Trans>
          }
        />
      )}*/}
    </ListWrapper>
  );
};

export default GaugeVoteListContainer;
