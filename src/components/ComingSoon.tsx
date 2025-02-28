import { Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';

const ComingSoon = () => {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        flex: 1,
      }}
    >
      <>
        <Box mb={8}>
          <Typography variant="h2" mb={2}>
            Going live soon 🚀
          </Typography>
          <Typography variant="h4" color={'text.muted'}>
            With emission voting, ZERO stakers can decide where ZERO emissions go based on votes
            that they give. Furthermore protocols can also create incentives or bribes to convince
            ZERO holders to vote for their pool.
          </Typography>
        </Box>
      </>
    </Paper>
  );
};

export default ComingSoon;
