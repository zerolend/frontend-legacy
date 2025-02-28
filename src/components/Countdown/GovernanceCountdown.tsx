import { Paper, PaperProps, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import Countdown from 'react-countdown';
import { governance_start_date } from '../../ui-config/marketsConfig';
import { Box } from '@mui/system';

interface GovernanceCountdownProps {
  loading?: boolean;
  description?: ReactNode;
  onComplete: (bool: boolean) => void;
  title: ReactNode;
}

const GovernanceCountdown = ({
  loading,
  description,
  title,
  onComplete,
  sx,
  ...rest
}: GovernanceCountdownProps & PaperProps) => {
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const valueVariant = downToSM ? 'main16' : 'h1';
  const symbolVariant = downToSM ? 'main14' : 'main21';

  return (
    <Paper
      {...rest}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        flex: 1,
        ...sx,
      }}
    >
      <>
        <Box mb={8}>
          <Typography variant="h2" mb={2}>
            {title}
          </Typography>
          {description && (
            <Typography variant="h4" color={'text.muted'}>
              {description}
            </Typography>
          )}
        </Box>
        {
          <Countdown
            date={governance_start_date}
            renderer={({ days, hours, minutes, seconds }) => {
              return (
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                  <Box p={2} borderRadius={2} bgcolor={'#00000060'}>
                    <Typography variant={valueVariant} color={'white'}>
                      {days < 10 ? `0${days}` : `${days}`}
                    </Typography>
                  </Box>
                  <Typography variant={symbolVariant} mx={2}>
                    days
                  </Typography>
                  <Box p={2} borderRadius={2} bgcolor={'#00000060'}>
                    <Typography variant={valueVariant} color={'white'}>
                      {hours < 10 ? `0${hours}` : `${hours}`}
                    </Typography>
                  </Box>
                  <Typography variant={symbolVariant} mx={2}>
                    hrs
                  </Typography>
                  <Box p={2} borderRadius={2} bgcolor={'#00000060'}>
                    <Typography variant={valueVariant} color={'white'}>
                      {minutes < 10 ? `0${minutes}` : `${minutes}`}
                    </Typography>
                  </Box>
                  <Typography variant={symbolVariant} mx={2}>
                    mins
                  </Typography>
                  <Box p={2} borderRadius={2} bgcolor={'#00000060'}>
                    <Typography variant={valueVariant} color={'white'}>
                      {seconds < 10 ? `0${seconds}` : `${seconds}`}
                    </Typography>
                  </Box>
                  <Typography variant={symbolVariant} mx={2}>
                    secs
                  </Typography>
                </Box>
              );
            }}
            onComplete={() => onComplete(true)}
          />
        }
      </>
    </Paper>
  );
};

export default GovernanceCountdown;
