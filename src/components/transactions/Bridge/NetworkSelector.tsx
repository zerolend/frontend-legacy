import { ChevronDownIcon } from '@heroicons/react/outline';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  SvgIcon,
  Typography,
} from '@mui/material';
import { MarketLogo } from 'src/components/MarketSwitcher';

import { SupportedNetworkWithChainId } from './common';
import { useEffect } from 'react';

interface NetworkSelectorProps {
  networks: SupportedNetworkWithChainId[];
  selectedNetwork: number;
  setSelectedNetwork: (value: number) => void;
  isSource: boolean;
  sourceChainId?: number;
}

export const NetworkSelector = ({
  networks,
  selectedNetwork,
  setSelectedNetwork,
  isSource,
  sourceChainId,
}: NetworkSelectorProps) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedNetwork(Number(event.target.value));
  };

  useEffect(() => {
    const LineaChainId = 59144;
    if (!isSource && sourceChainId != LineaChainId) {
      const lineaNetwork = networks.find(
        (network) => network.chainId === LineaChainId
      ) as SupportedNetworkWithChainId;

      networks = [lineaNetwork];
      selectedNetwork = LineaChainId;
      setSelectedNetwork(LineaChainId)
    }
  }, [isSource, sourceChainId, networks])

  return (
    <FormControl sx={{ minWidth: 'unset', width: 'unset' }}>
      <Select
        native={false}
        value={String(selectedNetwork)}
        onChange={handleChange}
        IconComponent={(props) => (
          <SvgIcon sx={{ fontSize: '14px' }} {...props}>
            <ChevronDownIcon />
          </SvgIcon>
        )}
        sx={{
          '&.MuiInputBase-root': {
            border: 0,
            '.MuiSelect-select': {
              display: 'flex',
              backgroundColor: 'transparent',
              border: 0,
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
      >
        {networks.map((network) => (
          <MenuItem value={network.chainId} key={`${network.name}`}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MarketLogo size={16} logo={network.networkLogoPath} />
              <Typography variant="subheader2">{network.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
