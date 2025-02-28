import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import WithdrawVestZeroModalContent from './WithdrawVestZeroModalContent';

export const WithdrawVestZeroModal = () => {
  const { type, close } = useModalContext();

  return (
    <BasicModal open={type === ModalType.WithdrawVestZERO} setOpen={close}>
      <WithdrawVestZeroModalContent />
    </BasicModal>
  );
};
