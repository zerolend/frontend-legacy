import { Box } from '@mui/material';
import { useCallback, useState } from 'react';
import { Asset, AssetInput } from './AssetInput';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { GasStation, getGasCosts } from '../../GasStation/GasStation';
import { parseUnits } from 'ethers/lib/utils';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useGasStation } from 'src/hooks/useGasStation';
import { IPaymasterResult } from 'src/store/paymasterSlice';
import { GaslessWarning } from 'src/components/Warnings/GaslessWarning';

export const paymasterAssets: Asset[] = [
  {
    address: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
    symbol: 'USDC',
    iconSymbol: 'USDC',
    decimals: 6,
    subsidy: 50,
    subsidyParty: 'Holdstation',
  },
  {
    address: '0x5FC44E95eaa48F9eB84Be17bd3aC66B6A82Af709',
    symbol: 'GRAI',
    iconSymbol: 'GRAI',
    decimals: 18,
  },
  {
    address: '0xed4040fD47629e7c8FBB7DA76bb50B3e7695F0f2',
    symbol: 'HOLD',
    iconSymbol: 'HOLD',
    decimals: 18,
  },
];

interface IProps {
  paymasterData?: IPaymasterResult;
  gasLimit?: string;
  skipLoad?: boolean;
  disabled?: boolean;
  setFeeTokenAddress?: (str: string) => void;
  gaslessOn?: boolean;
  amountinUSD?: number;
}

export default function FeeTokenSelector(props: IProps) {
  const [tokenToRepayWith, setTokenToRepayWith] = useState<Asset>(paymasterAssets[0]);

  const { reserves } = useAppDataContext();
  const { currentNetworkConfig } = useProtocolDataContext();
  const { wrappedBaseAssetSymbol } = currentNetworkConfig;

  const wrappedAsset = reserves.find(
    (t) => t.symbol.toLowerCase() === wrappedBaseAssetSymbol?.toLowerCase()
  );

  const {
    state,
    gasPriceData: { data },
  } = useGasStation();
  const gasLimit = parseUnits(props.gasLimit || '0', 'wei');

  const totalGasCostsUsd =
    data && wrappedAsset
      ? getGasCosts(gasLimit, state.gasOption, state.customGas, data, wrappedAsset.priceInUSD)
      : undefined;

  const onSelect = useCallback(
    (asset: Asset) => {
      setTokenToRepayWith(asset);
      if (props.setFeeTokenAddress) props.setFeeTokenAddress(asset.address);
    },
    [props.setFeeTokenAddress, setTokenToRepayWith]
  );

  if (!props.gaslessOn) {
    return <GasStation gasLimit={gasLimit} skipLoad={props.skipLoad} disabled={props.disabled} />;
  }

  return (
    <Box sx={{ pt: 3 }}>
      <AssetInput
        paymasterData={props.paymasterData}
        totalGasCostsUsd={totalGasCostsUsd}
        symbol={tokenToRepayWith.symbol}
        assets={paymasterAssets}
        onSelect={onSelect}
        amountInUSD={props.amountinUSD}
      />
      {Number(props.paymasterData?.estimatedFinalFeeUSD) > 5 && <GaslessWarning />}
    </Box>
  );
}
