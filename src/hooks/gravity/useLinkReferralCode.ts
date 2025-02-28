import { useCallback } from 'react';
import { SiweMessage } from 'siwe';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';
import { ethers } from 'ethers';
import { linkReferralCode } from '../../utils/ServerApi';

const getNonce = () => {
  return Math.floor(Date.now() / 1000).toString();
};

const createSiweMessage = (nonce: string, address: string, chainId: number) => {
  const message = new SiweMessage({
    domain: window.location.host,
    address: address,
    statement:
      'You are signing this message to verify your ownership with the ZeroLend Airdrop platform.' +
      ' This signature is unique and does not grant any special permissions to any of the assets in your wallet.',
    uri: window.location.origin,
    version: '1',
    chainId,
    nonce,
  });
  return message.prepareMessage();
};

const useLinkReferralCode = (referralCode: string) => {
  const { currentAccount, chainId, signData } = useWeb3Context();

  return useCallback(
    async (
      onInitiating: () => void,
      onSuccess: () => void,
      onFailure: (e: string) => void
    ): Promise<void> => {
      try {
        onInitiating();
        const checksum = ethers.utils.getAddress(currentAccount);

        const nounce = getNonce();
        const signingMessage = createSiweMessage(nounce, checksum, chainId);
        const response = await signData(signingMessage, checksum);

        linkReferralCode({
          walletAddress: checksum,
          message: signingMessage,
          signHash: response,
          referralCode: referralCode,
        })
          .then((res) => {
            if (res.success) {
              onSuccess();
            } else {
              onFailure(res?.data?.error || '');
            }
          })
          .catch((error) => {
            console.log(error);
            onFailure(error);
          });
      } catch (e: any) {
        console.log('checking task error', e);
        onFailure('');
      }
    },
    [referralCode]
  );
};

export default useLinkReferralCode;
