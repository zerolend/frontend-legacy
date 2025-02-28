import React from 'react';
import { ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { ClaimVestedTokenModalContent } from './ClaimVestedTokenModalContent';

export const ClaimVestedTokenModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    vestId: number;
    amount: string;
  }>;

  return (
    <BasicModal open={type === ModalType.ClaimVestedTokens} setOpen={close}>
      <ClaimVestedTokenModalContent vestId={args.vestId} claimableAmount={args.amount} />
    </BasicModal>
  );
};
