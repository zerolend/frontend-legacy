import { useCallback, useEffect, useState } from 'react';
import { useWeb3Context } from '../libs/hooks/useWeb3Context';
import { EZeroMerkleProofDataType } from '../modules/rewards/ZEROAirdrop';
import { useRootStore } from 'src/store/root';

interface EarlyZeroMerkleProofTypeState {
  isLoading: boolean;
  value: EZeroMerkleProofDataType | undefined;
}

export const NON_LOADING_EarlyZeroMerkleProofType: EarlyZeroMerkleProofTypeState = {
  isLoading: false,
  value: undefined,
};
export const LOADING_EarlyZeroMerkleProofType: EarlyZeroMerkleProofTypeState = {
  isLoading: true,
  value: undefined,
};

const useGetUsersMerkleProof = () => {
  const [data, setData] = useState<EarlyZeroMerkleProofTypeState>(LOADING_EarlyZeroMerkleProofType);
  const { currentAccount: walletAddress } = useWeb3Context();
  const setIsClaimed = useRootStore((store) => store.setIsClaimed);

  const fetchMerkleProof = useCallback(async () => {
    if (walletAddress !== '') {
      const url = `https://merkle.zerolend.xyz/merkleProof?walletAddress=${walletAddress}`;

      fetch(url)
        .then((res) => res.json())
        .then((res: EZeroMerkleProofDataType) => {
          if (res && res.address) {
            setData({ isLoading: false, value: res });
          } else {
            setIsClaimed(true);
            setData(NON_LOADING_EarlyZeroMerkleProofType);
          }
        })
        .catch((e) => {
          setData(NON_LOADING_EarlyZeroMerkleProofType);
          console.log('useGetUsersMerkleProof error', e);
        });
    } else {
      setData(NON_LOADING_EarlyZeroMerkleProofType);
    }
  }, [walletAddress]);

  useEffect(() => {
    setData(LOADING_EarlyZeroMerkleProofType);
    fetchMerkleProof().catch((err) => {
      setData({ isLoading: false, value: data.value });
      console.error(`Failed to fetch fetchZeroPoints Values: ${err.stack}`);
    });
  }, [fetchMerkleProof]);

  return data;
};

export default useGetUsersMerkleProof;
