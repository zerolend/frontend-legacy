import { XCircleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import {
  Box,
  BoxProps,
  Button,
  CircularProgress,
  IconButton,
  InputBase,
  Typography,
} from '@mui/material';
import React, { ReactNode, useRef } from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import { TrackEventProps } from 'src/store/analyticsSlice';
import { useRootStore } from 'src/store/root';

import { CapType } from '../../caps/helper';
import { AvailableTooltip } from '../../infoTooltips/AvailableTooltip';
import { FormattedNumber } from '../../primitives/FormattedNumber';
import { ExternalTokenIcon } from '../../primitives/TokenIcon';
import { TokenInfoWithBalance } from './BridgeModal';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  value: string;
}

export const NumberFormatCustom = React.forwardRef<NumberFormatProps, CustomProps>(
  function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          if (values.value !== props.value)
            onChange({
              target: {
                name: props.name,
                value: values.value || '',
              },
            });
        }}
        thousandSeparator
        isNumericString
        allowNegative={false}
      />
    );
  }
);

export interface AssetInputProps {
  value: string;
  usdValue: string;
  symbol: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  disableInput?: boolean;
  onSelect?: (asset: TokenInfoWithBalance) => void;
  assets: TokenInfoWithBalance[];
  capType?: CapType;
  maxValue?: string;
  isMaxSelected?: boolean;
  inputTitle?: ReactNode;
  balanceText?: ReactNode;
  loading?: boolean;
  event?: TrackEventProps;
  selectOptionHeader?: ReactNode;
  selectOption?: (asset: TokenInfoWithBalance) => ReactNode;
  sx?: BoxProps;
  chainId: number;
}

export const BridgeAssetInput = ({
  value,
  symbol,
  onChange,
  disabled,
  disableInput,
  assets,
  capType,
  maxValue,
  isMaxSelected,
  inputTitle,
  balanceText,
  loading = false,
  event,
  sx = {},
  chainId,
}: AssetInputProps) => {
  const trackEvent = useRootStore((store) => store.trackEvent);
  const inputBoxRef = useRef<HTMLDivElement>(null);

  const asset =
    assets.length === 1
      ? assets[0]
      : assets && assets.find((asset) => asset.symbol === symbol && asset.chainId === chainId);

  // invariant(asset, 'Asset not found');
  if (!asset) return null;
  return (
    <Box {...sx}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography color="text.secondary">
          {inputTitle ? inputTitle : <Trans>Amount</Trans>}
        </Typography>
        {capType && <AvailableTooltip capType={capType} />}
      </Box>

      <Box
        ref={inputBoxRef}
        sx={(theme) => ({
          p: '8px 12px',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '6px',
          mb: 1,
        })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          {loading ? (
            <Box sx={{ flex: 1 }}>
              <CircularProgress color="inherit" size="16px" />
            </Box>
          ) : (
            <InputBase
              sx={{ flex: 1 }}
              placeholder="0.00"
              disabled={disabled || disableInput}
              value={value}
              autoFocus
              onChange={(e) => {
                if (!onChange) return;
                if (Number(e.target.value) > Number(maxValue)) {
                  onChange('-1');
                } else {
                  onChange(e.target.value);
                }
              }}
              inputProps={{
                'aria-label': 'amount input',
                style: {
                  fontSize: '21px',
                  lineHeight: '28,01px',
                  padding: 0,
                  height: '28px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                },
              }}
              // eslint-disable-next-line
              inputComponent={NumberFormatCustom as any}
            />
          )}
          {value !== '' && !disableInput && (
            <IconButton
              sx={{
                minWidth: 0,
                p: 0,
                left: 8,
                zIndex: 1,
                color: 'text.muted',
                '&:hover': {
                  color: 'text.secondary',
                },
              }}
              onClick={() => {
                onChange && onChange('');
              }}
              disabled={disabled}
            >
              <XCircleIcon height={16} />
            </IconButton>
          )}
          <Box
            sx={{ display: 'flex', alignItems: 'center' }}
            data-cy={`assetsSelectedOption_${asset.symbol.toUpperCase()}`}
          >
            <ExternalTokenIcon
              symbol={asset.symbol}
              // aToken={asset.aToken}
              logoURI={asset.logoURI}
              sx={{ mr: 2, ml: 4 }}
            />
            <Typography variant="main16" color="text.primary">
              {symbol}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', height: '16px' }}>
          {loading ? (
            <Box sx={{ flex: 1 }} />
          ) : (
            // <FormattedNumber
            //   value={isNaN(Number(usdValue)) ? 0 : Number(usdValue)}
            //   compact
            //   symbol="USD"
            //   variant="secondary12"
            //   color="text.muted"
            //   symbolsColor="text.muted"
            //   flexGrow={1}
            // />
            <Box sx={{ flex: 1 }} />
          )}

          {asset.balance && (
            <>
              <Typography component="div" variant="secondary12" color="text.secondary">
                {balanceText && balanceText !== '' ? balanceText : <Trans>Balance</Trans>}{' '}
                <FormattedNumber
                  value={asset.balance}
                  compact
                  variant="secondary12"
                  color="text.secondary"
                  symbolsColor="text.disabled"
                />
              </Typography>
              {!disableInput && onChange && (
                <Button
                  size="small"
                  sx={{ minWidth: 0, ml: '7px', p: 0 }}
                  onClick={() => {
                    if (event) {
                      trackEvent(event.eventName, { ...event.eventParams });
                    }

                    onChange('-1');
                  }}
                  disabled={disabled || isMaxSelected}
                >
                  <Trans>Max</Trans>
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
