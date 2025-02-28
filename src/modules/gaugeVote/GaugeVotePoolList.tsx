import { Trans } from '@lingui/macro';
import { ListHeaderWrapper } from '../../components/lists/ListHeaderWrapper';
import { ListColumn } from '../../components/lists/ListColumn';
import { ListHeaderTitle } from '../../components/lists/ListHeaderTitle';
import { Box, useMediaQuery } from '@mui/material';
import { useMemo, useState } from 'react';
import GuageVotePoolsDesktopItem from './GuageVotePoolsDesktopItem';
import GuageVoteAction from './GuageVoteAction';
// import { BigNumber } from 'ethers';
import useGetAllPools from 'src/hooks/poolVoting/useGetAllPools';

const listHeaders = [
  {
    title: <Trans>Pool Name</Trans>,
    sortKey: 'poolName',
  },
  {
    title: <Trans>Tvl</Trans>,
    sortKey: 'tvl',
  },
  {
    title: <Trans>Total Votes</Trans>,
    sortKey: 'overallVotes',
  },
  {
    title: <Trans>Your Vote</Trans>,
    sortKey: 'yourVotes',
  },
  {
    title: <Trans>Vote</Trans>,
    sortKey: 'action',
  },
];

export interface IGuageData {
  poolName: string;
  poolAddress: string;
  apr: number;
  overallVotes: string;
  yourVotes: string;
}

type GuageVotePoolListProps = {
  guages: any[];
  loading: boolean;
};

// const DemoGauge: IGuageData[] = [
//   {
//     poolName: 'XYZ/ABC',
//     poolAddress: '0xaf677116A9A79ca562c819ada66574D40e09a3e2',
//     apr: 0,
//     overallVotes: '5000',
//     yourVotes: '2',
//   },
//   {
//     poolName: 'XYZ/ABC',
//     poolAddress: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
//     apr: 0,
//     overallVotes: '5000',
//     yourVotes: '2',
//   },
//   {
//     poolName: 'XYZ/ABC',
//     poolAddress: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
//     apr: 0,
//     overallVotes: '5000',
//     yourVotes: '2',
//   },
//   {
//     poolName: 'XYZ/ABC',
//     poolAddress: '0xbfE1A90d2B566e0CE98787fC33CC8Cc70be88608',
//     apr: 0,
//     overallVotes: '5000',
//     yourVotes: '2',
//   },
//   {
//     poolName: 'XYZ/ABC',
//     poolAddress: '0xf07651419D912A4CEdD72Da184F660BDf445042A',
//     apr: 0,
//     overallVotes: '5000',
//     yourVotes: '2',
//   },
//   {
//     poolName: 'XYZ/ABC',
//     poolAddress: '0xCF578130C1C361Da5f73fdf7F12d2BF7cbc66c50',
//     apr: 0,
//     overallVotes: '5000',
//     yourVotes: '2',
//   },
// ];

const GaugeVotePoolList = ({}: GuageVotePoolListProps) => {
  const isTableChangedToCards = useMediaQuery('(max-width:1125px)');
  const [sortName, setSortName] = useState('poolName');
  const [sortDesc, setSortDesc] = useState(false);
  const [pools, setPools] = useState<string[]>([]);
  const [sliderValues, setSliderValues] = useState<number[]>([]);

  const { data: getPool } = useGetAllPools();

  const filteredGuages = getPool;

  const totalVotes = useMemo(() => {
    return sliderValues.reduce((a, b) => a + Math.abs(b), 0);
  }, [sliderValues]);

  const handleSliderChange = (index: any, event: any) => {
    const newValue = parseInt(event.value);
    const total =
      newValue + sliderValues.reduce((acc, val, i) => (i !== index ? acc + val : acc), 0);

    if (total <= 100) {
      const newSliderValues = [...sliderValues];
      newSliderValues[index] = newValue;
      setSliderValues(newSliderValues);
    } else {
      const remaining =
        100 - sliderValues.reduce((acc, val, i) => (i !== index ? acc + val : acc), 0);
      const newSliderValues = [...sliderValues];
      newSliderValues[index] = remaining;
      setSliderValues(newSliderValues);
    }

    if (!pools.includes(event.name)) setPools([...pools, event.name]);
  };

  return (
    <Box position={'relative'}>
      <GuageVoteAction totalVotes={totalVotes} pools={pools} sliderValues={sliderValues} />
      {!isTableChangedToCards && (
        <ListHeaderWrapper px={6}>
          {listHeaders.map((col) => (
            <ListColumn
              isRow={col.sortKey === 'poolName'}
              maxWidth={col.sortKey === 'poolName' ? 340 : undefined}
              minWidth={col.sortKey === 'action' ? 280 : undefined}
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

      {filteredGuages?.map((gauge, index) => {
        return isTableChangedToCards ? (
          <></>
        ) : (
          <GuageVotePoolsDesktopItem
            key={index}
            gauge={gauge}
            setUserPoolData={(e) => {
              // userPoolData(e.name, e.value, index);
              handleSliderChange(index, e.target);
            }}
          />
        );
      })}
    </Box>
  );
};

export default GaugeVotePoolList;
