import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import DiscountIcon from '@mui/icons-material/Discount';

import { Trans } from '@lingui/macro';
import {
  Box,
  FormControl,
  IconButton,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
  CircularProgress,
} from '@mui/material';
import React, { ReactNode } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { IPaymasterResult } from 'src/store/paymasterSlice';
import useGetTokenBalance from 'src/hooks/tokens/useGetTokenBalance';
import { normalizeBN } from '@aave/math-utils';

export interface Asset {
  balance?: string;
  symbol: string;
  iconSymbol?: string;
  address: string;
  aToken?: boolean;
  priceInUsd?: string;
  decimals?: number;
  subsidy?: number;
  subsidyParty?: string;
}

interface AssetInputProps<T extends Asset = Asset> {
  paymasterData?: IPaymasterResult;
  symbol: string;
  totalGasCostsUsd?: number;
  onSelect?: (asset: T) => void;
  assets: T[];
  selectOptionHeader?: ReactNode;
  selectOption?: (asset: T) => ReactNode;
  amountInUSD?: number;
}

export const AssetInput = <T extends Asset = Asset>({
  paymasterData,
  symbol,
  totalGasCostsUsd = 0,
  onSelect,
  assets,
  selectOptionHeader,
  selectOption,
  amountInUSD,
}: AssetInputProps<T>) => {
  const theme = useTheme();

  const handleSelect = (event: SelectChangeEvent) => {
    const newAsset = assets.find((asset) => asset.symbol === event.target.value) as T;
    onSelect && onSelect(newAsset);
  };

  const amt =
    symbol === 'ETH'
      ? totalGasCostsUsd.toFixed(3)
      : paymasterData && paymasterData.estimatedFinalFeeUSD
      ? Number(paymasterData.estimatedFinalFeeUSD).toFixed(3)
      : '-';

  const asset =
    assets.length === 1
      ? assets[0]
      : assets && (assets.find((asset) => asset.symbol === symbol) as T);

  return (
    <Box
      sx={{
        background: '#f6f6f6',
        borderRadius: '6px',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          color: '#999',
          p: 2,
        }}
      >
        <Typography variant="caption">
          <Trans>Transaction Cost</Trans>
        </Typography>
        <TextWithTooltip>
          <Trans>
            You can choose a different asset other than ETH to pay your transaction fees. This can
            be any supported ERC20 token.
          </Trans>
        </TextWithTooltip>
      </Box>

      <Box sx={{ p: '0 12px 8px 12px' }}>
        {paymasterData && (
          <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <IconButton
              sx={{
                minWidth: 0,
                p: 0,
                zIndex: 1,
                color: 'text.muted',
                '&:hover': {
                  color: 'text.secondary',
                },
              }}
            >
              <DiscountIcon color="primary" sx={{ fontSize: '16px', mr: 1.5 }} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '14px',
                flex: 1,
                lineHeight: '2',
                padding: 0,
                height: '28px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {paymasterData?.markup}
            </Typography>
          </Box>
        )}
        <Box
          sx={{ display: 'flex', alignItems: 'center', mb: 0.5, justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <IconButton
              sx={{
                minWidth: 0,
                p: 0,
                zIndex: 1,
                color: 'text.muted',
                '&:hover': {
                  color: 'text.secondary',
                },
              }}
            >
              <LocalGasStationIcon color="primary" sx={{ fontSize: '16px', mr: 1.5 }} />
            </IconButton>

            {!paymasterData && amt === '-' ? (
              amountInUSD === 0 ? (
                <Typography
                  sx={{
                    fontSize: '14px',
                    flex: 1,
                    lineHeight: '2',
                    padding: 0,
                    height: '28px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  -
                </Typography>
              ) : (
                <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
              )
            ) : (
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <FormattedNumber value={amt} symbol="USD" color="text.secondary" />
                <Typography sx={{ ml: 2 }}>(Approx)</Typography>
              </Box>
            )}
          </Box>

          {!onSelect || assets.length === 1 ? (
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <TokenIcon
                aToken={asset.aToken}
                symbol={asset.iconSymbol || asset.symbol}
                sx={{ mr: 2, ml: 4 }}
                fontSize={'inherit'}
              />
              <Typography variant="h3" sx={{ lineHeight: '28px' }} data-cy={'inputAsset'}>
                {symbol}
              </Typography>
            </Box>
          ) : (
            <FormControl>
              <Select
                value={asset.symbol}
                onChange={handleSelect}
                variant="outlined"
                className="AssetInput__select"
                data-cy={'assetSelect'}
                MenuProps={{
                  sx: {
                    maxHeight: '240px',
                    '.MuiPaper-root': {
                      border: theme.palette.mode === 'dark' ? '1px solid #EBEBED1F' : 'unset',
                      boxShadow: '0px 2px 10px 0px #0000001A',
                    },
                  },
                }}
                sx={{
                  p: 0,
                  '&.AssetInput__select .MuiOutlinedInput-input': {
                    p: 0,
                    backgroundColor: 'transparent',
                    pr: '24px !important',
                  },
                  '&.AssetInput__select .MuiOutlinedInput-notchedOutline': { display: 'none' },
                  '&.AssetInput__select .MuiSelect-icon': {
                    color: 'text.primary',
                    right: '0%',
                  },
                }}
                renderValue={(symbol) => {
                  const asset =
                    assets.length === 1
                      ? assets[0]
                      : assets && (assets.find((asset) => asset.symbol === symbol) as T);
                  return (
                    <Box
                      sx={{ display: 'flex', alignItems: 'center' }}
                      data-cy={`assetsSelectedOption_${asset.symbol.toUpperCase()}`}
                    >
                      <TokenIcon
                        symbol={asset.iconSymbol || asset.symbol}
                        aToken={asset.aToken}
                        sx={{ mr: 2, ml: 4 }}
                      />
                      <Typography variant="main16" color="text.primary">
                        {symbol}
                      </Typography>
                    </Box>
                  );
                }}
              >
                {selectOptionHeader ? selectOptionHeader : undefined}
                {assets.map((asset) => (
                  <MenuItem
                    key={asset.symbol}
                    value={asset.symbol}
                    data-cy={`assetsSelectOption_${asset.symbol.toUpperCase()}`}
                  >
                    {selectOption ? (
                      selectOption(asset)
                    ) : (
                      <>
                        <TokenIcon
                          aToken={asset.aToken}
                          symbol={asset.iconSymbol || asset.symbol}
                          sx={{ fontSize: '22px', mr: 1 }}
                        />
                        <ListItemText sx={{ mr: 6 }}>{asset.symbol}</ListItemText>
                        <FormattedNumber
                          value={normalizeBN(
                            useGetTokenBalance(asset.address).toString(),
                            asset.decimals || 18
                          ).toString()}
                          compact
                        />
                      </>
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          textAlign: 'center',
          flex: 1,
          background: theme.palette.divider,
          p: 2,
        }}
      >
        <Typography variant="caption" sx={{ margin: 'auto', color: '#333' }}>
          Paymasters are an experimental feature. Use it at you own risk. Paymaster integration is
          powered by zyfi.org. You are paying transaction fees in {asset.iconSymbol}.
        </Typography>
      </Box>
    </Box>
  );
};
