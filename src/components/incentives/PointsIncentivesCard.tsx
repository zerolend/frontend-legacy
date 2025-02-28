import { PointsIncentivesButton } from './PointsIncentivesButton';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useProtocolDataContext } from '../../hooks/useProtocolDataContext';
import { borrowPointsConfig, supplyPointsConfig } from '../../ui-config/pointsConfig-v2';

interface IProps {
  showZeroIncentive: boolean;
  isSupply?: boolean;
  symbol: string;
  leftAlign?: boolean;
  rightAlign?: boolean;
}

const PointsIncentivesCard = ({ symbol, isSupply, leftAlign, rightAlign }: IProps) => {
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentMarket } = useProtocolDataContext();

  const supplyPointsIncentive = supplyPointsConfig[currentMarket]
    ? supplyPointsConfig[currentMarket][`${symbol.toLowerCase()}`] || []
    : [];
  const borrowPointsIncentive = borrowPointsConfig[currentMarket]
    ? borrowPointsConfig[currentMarket][`${symbol.toLowerCase()}`] || []
    : [];
  const hasSupplyPoints = supplyPointsIncentive && supplyPointsIncentive.length > 0;
  const hasBorrowPoints = supplyPointsIncentive && supplyPointsIncentive.length > 0;

  return (
    <Box
      mt={1}
      display={'flex'}
      flexDirection={'column'}
      alignItems={downToSM || rightAlign ? 'flex-end' : leftAlign ? 'flex-start' : 'center'}
    >
      {hasSupplyPoints && isSupply && (
        <Box display={'flex'}>
          {supplyPointsIncentive?.map((p, index) => (
            <Box key={index} ml={-1}>
              <PointsIncentivesButton {...p} />
            </Box>
          ))}
        </Box>
      )}
      {hasBorrowPoints && !isSupply && (
        <Box display={'flex'}>
          {borrowPointsIncentive?.map((p, index) => (
            <Box key={index} ml={-1}>
              <PointsIncentivesButton {...p} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PointsIncentivesCard;
