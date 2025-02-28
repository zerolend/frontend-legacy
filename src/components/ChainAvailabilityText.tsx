import { ChainId } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Box, BoxProps, Typography } from '@mui/material';
import { BaseNetworkConfig, networkConfigs } from 'src/ui-config/networksConfig';

type ChainAvailabilityTextProps = {
  chainId: number;
  wrapperSx: BoxProps['sx'];
};

const networkToTextMapper = (chainId: number, networkConfig: BaseNetworkConfig) => {
  switch (chainId) {
    case ChainId.mainnet:
      return 'Ethereum Mainnet';
    default:
      return networkConfig.name;
  }
};

export const ChainAvailabilityText: React.FC<ChainAvailabilityTextProps> = ({
  chainId,
  wrapperSx,
}) => {
  const network = networkConfigs[chainId];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...wrapperSx }}>
      <Typography variant="subheader1" sx={{ mr: 2, color: '#C0CBF6' }}>
        <Trans>Available on</Trans>
      </Typography>
      <Box
        sx={{
          height: 16,
          width: 16,
        }}
      >
        <img src={network.networkLogoPath} height="100%" width="100%" alt={`${network?.name}`} />
      </Box>
      <Typography variant="subheader1" sx={{ ml: 1, color: '#C0CBF6' }}>
        {networkToTextMapper(chainId, network)}
      </Typography>
    </Box>
  );
};
