import { valueToWei } from '@aave/contract-helpers';
import { valueToBigNumber } from '@aave/math-utils';
import { useCallback, useEffect, useState } from 'react';
import { useRootStore } from 'src/store/root';

export function useGetLPAPR(vePower?: string, principal?: string) {
  const [value, setValue] = useState(0);

  const [rewardRate, totalSupply] = useRootStore((store) => [
    store.LPrewardRate,
    store.LPtotalSupply,
  ]);

  const e18 = valueToWei('1', 18);

  const ETHZero = 6753941;

  const fetchAPR = useCallback(async () => {
    if (rewardRate.toString() === '0' || totalSupply.toString() === '0') return setValue(0);
    if (vePower?.toString() === '0' || principal?.toString() === '0') return setValue(0);
    if (vePower?.toString() === '0' || principal?.toString() === '0') return setValue(0);

    const scale =
      vePower && principal
        ? valueToBigNumber(vePower).multipliedBy(e18).dividedBy(principal)
        : valueToWei('1', 18);

    // rewards * secs in year * ETH-ZERO value
    const poolRewardsAnnual = valueToBigNumber(rewardRate.toString())
      .multipliedBy(31536000)
      .multipliedBy(ETHZero);

    // apr = rewards earned / principal(omni balance of)
    const apr = poolRewardsAnnual.multipliedBy(1000).div(totalSupply.toString());

    const aprScaled = apr.multipliedBy(scale).div(e18).toNumber() / 1000;

    setValue(aprScaled);
  }, [vePower, totalSupply, rewardRate]);

  useEffect(() => {
    fetchAPR().catch((err) => {
      console.error(`Failed to fetch Apr Values: ${err.stack}`);
    });
  }, [fetchAPR]);

  return value;
}
