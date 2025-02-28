import { useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormattedNumber } from '../../../components/primitives/FormattedNumber';

interface RateNumberProps {
  value: number;
  rate: number;
}

const RateNumber = (props: RateNumberProps) => {
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const valueTypographyVariant = downToSM ? 'main16' : 'h1';
  const symbolsVariant = downToSM ? 'secondary16' : 'h1';

  const [point, setPoint] = useState<number>(0);
  const [decimals, setDecimals] = useState<number>(2);

  useEffect(() => {
    if (point === 0) {
      const rateSpilted = props.rate.toString().split('.');
      if (!Number(rateSpilted[0])) {
        const numberAfterDecimal = props.rate.toString().split('.')[1];
        const index = numberAfterDecimal.length - Number(numberAfterDecimal).toString().length;
        if (index > 0) setDecimals(index + 1 > 5 ? 2 : index + 1);
      } else {
        setDecimals(2);
      }

      setPoint(props.value);
      setInterval(() => {
        setPoint((prevPoint) => prevPoint + (props.rate * 1));
      }, 1000);
    }
  }, [props.value]);

  /*const point = useMemo(() => {
    let points = props.value;
    setInterval(() => {
      points = points + props.rate;
      return points;
    }, 1000);
    return points;
  }, []);*/

  return (
    <FormattedNumber
      value={point}
      variant={valueTypographyVariant}
      visibleDecimals={decimals}
      compact={false}
      symbolsColor="#A5A8B6"
      symbolsVariant={symbolsVariant}
      sx={{ transition: '0.5s ease-in-out' }}
    />
  );
};

export default RateNumber;
