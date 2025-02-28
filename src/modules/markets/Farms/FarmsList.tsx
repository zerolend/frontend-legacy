import { Trans } from '@lingui/macro';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { FarmsListItem } from './FarmsListItem';
import { FarmConfig } from '../../../ui-config/farmConfig';

const listHeaders = [
  {
    title: <Trans>Farm Name</Trans>,
    sortKey: 'name',
  },
  {
    title: <Trans>Platform</Trans>,
    sortKey: 'platform',
  },
  {
    title: <Trans>Rewards Token</Trans>,
    sortKey: 'totalLiquidityUSD',
  },
  {
    title: <Trans>APY</Trans>,
    sortKey: 'supplyAPY',
  },
];

export default function FarmsList() {
  const isTableChangedToCards = useMediaQuery('(max-width:1125px)');
  const [sortName, setSortName] = useState('');
  const [sortDesc, setSortDesc] = useState(false);

  return (
    <>
      {!isTableChangedToCards && (
        <ListHeaderWrapper px={6}>
          {listHeaders.map((col) => (
            <ListColumn
              isRow={col.sortKey === 'symbol'}
              maxWidth={col.sortKey === 'symbol' ? 280 : undefined}
              key={col.sortKey}
            >
              <ListHeaderTitle
                sortName={sortName}
                sortDesc={sortDesc}
                setSortName={setSortName}
                setSortDesc={setSortDesc}
                sortKey={col.sortKey}
                source="Markets Page"
              >
                {col.title}
              </ListHeaderTitle>
            </ListColumn>
          ))}
          <ListColumn maxWidth={95} minWidth={95} />
        </ListHeaderWrapper>
      )}

      {FarmConfig.map(
        (data) => (
          // isTableChangedToCards ? (
          //   <div/>
          //   <MarketAssetsListMobileItem {...reserve} key={reserve.id} />
          // ) : (
          <FarmsListItem key={data.id} data={data} />
        )
        // )
      )}
    </>
  );
}
