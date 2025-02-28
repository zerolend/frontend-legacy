import { Trans } from '@lingui/macro';
import { Box, Divider, FormLabel, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import * as React from 'react';
import { IVests } from 'src/helpers/types';

import { FormattedNumber } from '../../primitives/FormattedNumber';
import { TokenIcon } from '../../primitives/TokenIcon';
import { normalize } from '@aave/math-utils';

export type RewardsSelectProps = {
  nfts: IVests[];
  setSelectedNFT: (key: string) => void;
  selectedNFT: string;
};

export const VestsSelect = ({ nfts, selectedNFT, setSelectedNFT }: RewardsSelectProps) => {
  return (
    <FormControl sx={{ mb: 1, width: '100%' }}>
      <FormLabel sx={{ mb: 1, color: 'text.secondary' }}>
        {`Unlocked Vest${selectedNFT === '0' ? '(s)' : ''} to claim`}
      </FormLabel>

      <Select
        value={selectedNFT}
        onChange={(e) => {
          setSelectedNFT(e.target.value);
        }}
        sx={{
          width: '100%',
          height: '44px',
          borderRadius: '6px',
          borderColor: 'divider',
          outline: 'none !important',
          color: 'text.primary',
          '.MuiOutlinedInput-input': {
            backgroundColor: 'transparent',
          },
          '&:hover .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
            outline: 'none !important',
            borderWidth: '1px',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
            borderWidth: '1px',
          },
          '.MuiSelect-icon': { color: 'text.primary' },
        }}
        native={false}
        renderValue={(nft) => {
          if (nft === '0') {
            return (
              <Typography color="text.primary">
                <Trans>Claim all Vests</Trans>
              </Typography>
            );
          }
          const selected = nfts.find((r) => r.id.toString() === nft) as IVests;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TokenIcon symbol={'ZERO'} sx={{ mr: 2, fontSize: '16px' }} />
              <Typography color="text.primary">Vest #{selected.id.toString()}</Typography>
            </Box>
          );
        }}
      >
        <MenuItem value={'0'}>
          <Typography variant="subheader1">
            <Trans>Claim all Vests</Trans>
          </Typography>
        </MenuItem>
        <Divider />
        {nfts.map((nft, index) => (
          <MenuItem value={nft.id.toString()} key={index}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              width={'100%'}
            >
              <Typography variant="subheader1" sx={{ mr: 1 }} flex={1}>
                Vest #{nft.id.toString()}
              </Typography>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <FormattedNumber
                    value={normalize(nft.claimable.toString(), 18).toString()}
                    variant="h4"
                    compact
                  />
                  <TokenIcon symbol={'zero'} sx={{ ml: 1, fontSize: '16px' }} />
                </Box>
                <Box>
                  <Typography
                    component="span"
                    sx={{ display: 'inline-flex', alignItems: 'center' }}
                    variant="caption"
                    color="text.muted"
                  >
                    ~
                  </Typography>
                  <FormattedNumber
                    value={normalize(nft.claimable.toString(), 18).toString()}
                    variant="caption"
                    compact
                    symbol="USD"
                    symbolsColor="text.muted"
                    color="text.muted"
                  />
                </Box>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
