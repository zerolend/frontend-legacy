import React from 'react';
import { Box, Slider, Typography } from '@mui/material';

export interface LoopContentProps {
  leverageValue: number;
  handleChange: (value: number) => void;
}

export const LoopContent = React.memo(({ leverageValue, handleChange }: LoopContentProps) => {
  const handleSliderChange = (newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      handleChange(newValue);
    }
  };

  return (
    <>
      <Box>
        <Typography id="non-linear-slider" align="center" gutterBottom>
          Leverage: x{leverageValue}
        </Typography>
        <Slider
          value={leverageValue}
          defaultValue={1.1}
          min={1.1}
          step={0.04}
          max={4}
          onChange={(_e, value, _activeThumb) => handleSliderChange(value)}
          valueLabelDisplay="off"
        />
      </Box>
    </>
  );
});
