import { Trans } from '@lingui/macro';
import { Box, FormLabel, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import * as React from 'react';
import { IVests } from 'src/helpers/types';

export type VestSelectProps = {
  vests: IVests[];
  setSelectedVest: (vestId: number) => void;
  selectedVest: number;
};

export const VestSelect = ({ vests, setSelectedVest, selectedVest }: VestSelectProps) => {
  return (
    <FormControl sx={{ mb: 1, width: '100%' }}>
      <FormLabel sx={{ mb: 1, color: 'text.secondary' }}>
        <Trans>All your vests</Trans>
      </FormLabel>

      <Select
        value={selectedVest}
        onChange={(e) => setSelectedVest(Number(e.target.value))}
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
        renderValue={(vest) => {
          const id = Number(vest);
          const selected = vests.find((r) => r.id === id) as IVests;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography color="text.primary">{selected.id}</Typography>
            </Box>
          );
        }}
      >
        {vests.map((vest) => (
          <MenuItem value={vest.id} key={`vest-id-${vest.id}`}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subheader1" sx={{ mr: 1 }}>
                Vest id: {vest.id}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
