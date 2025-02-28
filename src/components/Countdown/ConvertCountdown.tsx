import { PaperProps, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import Countdown from 'react-countdown';
import { convert_start_date } from '../../ui-config/marketsConfig';
import { Box } from '@mui/system';

interface GovernanceCountdownProps {
  loading?: boolean;
  description?: ReactNode;
  title: ReactNode;
}

const ConvertCountdown = ({ description, title }: GovernanceCountdownProps & PaperProps) => {
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const valueVariant = downToSM ? 'main16' : 'main16';
  const symbolVariant = downToSM ? 'main14' : 'main14';

  return (
    <Countdown
      date={convert_start_date}
      renderer={({ days, hours, minutes, seconds }) => {
        return (
          <Box mb={8}>
            <Box mb={2}>
              <Typography variant="h4" mb={2} textAlign={'center'}>
                {title}
              </Typography>
              {description && (
                <Typography variant="h4" color={'text.muted'}>
                  {description}
                </Typography>
              )}
            </Box>
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
              <Box p={1} px={2} borderRadius={2} bgcolor={'#00000060'}>
                <Typography variant={valueVariant} color={'white'}>
                  {days < 10 ? `0${days}` : `${days}`}
                </Typography>
              </Box>
              <Typography variant={symbolVariant} mx={2}>
                days
              </Typography>
              <Box p={1} px={2} borderRadius={2} bgcolor={'#00000060'}>
                <Typography variant={valueVariant} color={'white'}>
                  {hours < 10 ? `0${hours}` : `${hours}`}
                </Typography>
              </Box>
              <Typography variant={symbolVariant} mx={2}>
                hrs
              </Typography>
              <Box p={1} px={2} borderRadius={2} bgcolor={'#00000060'}>
                <Typography variant={valueVariant} color={'white'}>
                  {minutes < 10 ? `0${minutes}` : `${minutes}`}
                </Typography>
              </Box>
              <Typography variant={symbolVariant} mx={2}>
                mins
              </Typography>
              <Box p={1} px={2} borderRadius={2} bgcolor={'#00000060'}>
                <Typography variant={valueVariant} color={'white'}>
                  {seconds < 10 ? `0${seconds}` : `${seconds}`}
                </Typography>
              </Box>
              <Typography variant={symbolVariant} mx={2}>
                secs
              </Typography>
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default ConvertCountdown;
