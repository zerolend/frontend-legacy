import { Box, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { FormattedNumber } from '../../../components/primitives/FormattedNumber';
import RateNumber from './RateNumber';

interface PointsCardProps {
  title: string;
  description?: string;
  value: number;
  valueLoading: boolean;
  comingSoon?: boolean;
  rate?: number;
  textHint?: string;
  textValue?: string;
}

const PointsCard = (props: PointsCardProps) => {
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const upToSM = useMediaQuery(theme.breakpoints.up('sm'));
  const valueTypographyVariant = downToSM ? 'main16' : 'h1';
  const symbolsVariant = downToSM ? 'secondary16' : 'h1';

  const decimals: number = useMemo(() => {
    let decimals = 0;
    if (props.rate) {
      const numberAfterDecimal = props.rate.toString().split('.')[1];
      const index = numberAfterDecimal.length - Number(numberAfterDecimal).toString().length;
      if (index > 0) decimals = (index + 1 > 5 ? 2 : index + 1);
      else decimals = 2;
    }
    return decimals;
  }, [props.rate]);

  return (
    <ListWrapper
      titleComponent={
        <Box>
          <Typography component="div" variant="h3" sx={{ mr: 4 }}>
            {`${props.title}`}
          </Typography>
          {props.description && (
            <Typography
              component="p"
              variant="description"
              fontSize={12}
              sx={{ mr: 4 }}
              color={'text.muted'}
            >
              {`${props.description}`}
            </Typography>
          )}
        </Box>
      }
    >
      <Box px={6}>
        <Box mb={4} pb={4}>
          {!props.comingSoon ? (
            !props.valueLoading ? (
              <>
                {props.textValue ?
                  (<Typography variant={valueTypographyVariant}>
                    {props.textValue}
                  </Typography>)
                  : (props?.rate
                    ? <RateNumber value={props.value} rate={props.rate} />
                    : <FormattedNumber
                      value={props.value}
                      variant={valueTypographyVariant}
                      visibleDecimals={2}
                      compact={false}
                      symbolsColor="#A5A8B6"
                      symbolsVariant={symbolsVariant}
                    />)
                }
                {!props.textHint && <Typography variant={'caption'} color={'text.muted'}>
                  {`Earning ${props.rate?.toFixed(decimals)} points per second`}
                </Typography>}
                {props.textHint && <Typography variant={'caption'} color={'text.muted'}>
                  {props.textHint}
                </Typography>}
              </>
            ) : (
              <Skeleton width={60} height={upToSM ? 28 : 24} sx={{ background: '#27264C' }} />
            )
          ) : (
            <Typography variant={valueTypographyVariant}>Coming Soon....</Typography>
          )}
        </Box>
      </Box>
    </ListWrapper>
  );
};

export default PointsCard;
