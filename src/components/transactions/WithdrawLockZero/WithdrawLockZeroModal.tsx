import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { WithdrawLockZeroModalContent } from './WithdrawLockZeroModalContent';

export const WithdrawLockZeroModal = () => {
  const { type, close, args } = useModalContext();

  return (
    <BasicModal open={type === ModalType.WithdrawLockZero} setOpen={close}>
      <WithdrawLockZeroModalContent
        icon={args.icon || ''}
        lockId={args.nftId || 0}
        lockAmount={args.amount || ''}
      />
    </BasicModal>
  );
};
