import { valueToWei } from '@aave/contract-helpers';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useRootStore } from 'src/store/root';

export function useGetRewardRateValue(vePower?: BigNumber, principal?: BigNumber) {
  const [value, setValue] = useState(0);

  const [rewardRate, totalSupply] = useRootStore((store) => [store.rewardRate, store.totalSupply]);

  const e18 = valueToWei('1', 18);

  const fetchAPR = useCallback(async () => {
    if (rewardRate.toString() === '0' || totalSupply.toString() === '0') return setValue(0);
    if (vePower?.toString() === '0' || principal?.toString() === '0') return setValue(0);
    if (vePower?.toString() === '0' || principal?.toString() === '0') return setValue(0);

    const scale =
      vePower && principal ? BigNumber.from(vePower).mul(e18).div(principal) : valueToWei('1', 18);

    // rewards * secs in year
    const poolRewardsAnnual = rewardRate.mul(31536000);

    // apr = rewards earned / principal(omni balance of)
    const apr = poolRewardsAnnual.mul(1000).div(totalSupply);

    const aprScaled = apr.mul(scale).div(e18).toNumber() / 1000;

    setValue(aprScaled);
  }, [vePower, totalSupply, rewardRate]);

  useEffect(() => {
    fetchAPR().catch((err) => {
      console.error(`Failed to fetch Apr Values: ${err.stack}`);
    });
  }, [fetchAPR]);

  return value;
}
