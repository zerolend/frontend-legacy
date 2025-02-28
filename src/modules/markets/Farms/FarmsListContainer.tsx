import { ListWrapper } from '../../../components/lists/ListWrapper';
import { Box, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import FarmsList from './FarmsList';

const FarmsListContainer = () => {
  return (
    <ListWrapper
      titleComponent={
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography component="div" variant="h2" sx={{ mr: 4, mb: 2 }}>
              <Trans>Partner Farms</Trans>
            </Typography>
            <Typography component="div" variant="description" sx={{ mr: 4 }}>
              <Trans>
                Here you can find the various partner farms that have either integrated with
                ZeroLend or have farms with the ONEZ stablecoin.
              </Trans>
            </Typography>
          </Box>
        </>
      }
    >
      <>
        <FarmsList />
      </>
    </ListWrapper>
  );
};

export default FarmsListContainer;
