import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';

interface IProps {
  totalVotes: number;
  pools: string[];
  sliderValues: number[];
}

const TotalVotingPower = 100;

const GuageVoteAction = (props: IProps) => {
  const { totalVotes, pools, sliderValues } = props;
  const [weights, setWeights] = useState<number[]>([]);
  const [creatVote] = useRootStore((state) => [state.creatVote]);
  const { sendTx, currentAccount } = useWeb3Context();

  const calculateWeight = async () => {
    const calcWeights = [];
    for (let i = 0; i < sliderValues.length; i++) {
      const weight = (TotalVotingPower * sliderValues[i]) / 100;

      calcWeights.push(weight);
    }
    setWeights(calcWeights);

    const tx = creatVote({ pool: pools, weight: weights });
    const txData = await tx;
    txData.from = currentAccount;

    const res = await sendTx(txData);

    await res.wait(1);
  };

  return (
    <Box
      position={'fixed'}
      bottom={32}
      left={0}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      width="100%"
      zIndex={9999}
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        p={3}
        bgcolor={'white'}
        border={'1px solid #27264C'}
        borderRadius={2}
      >
        <Typography variant={'h4'} mr={4} color={'text.primary'} flex={1}>
          Voting Power Used: {totalVotes}%
        </Typography>
        <Button variant="contained" onClick={calculateWeight}>
          Vote
        </Button>
      </Box>
    </Box>
  );
};

export default GuageVoteAction;
