import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { LockZeroModalContent } from './LockZeroModalContent';

export const LockZeroModal = () => {
  const { type, close, args } = useModalContext();
  return (
    <BasicModal open={type === ModalType.LockZero} setOpen={close}>
      <LockZeroModalContent
        icon={'ZERO'}
        amount={args.amount || ''}
        duration={args.duration}
        stakeNFT={args.stakeNFT || false}
        apr={''}
      />
    </BasicModal>
  );
};
