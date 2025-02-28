import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { NewLockZeroModalContent } from './NewLockZeroModalContent';

export const NewLockZeroModal = () => {
  const { type, close } = useModalContext();
  return (
    <BasicModal open={type === ModalType.NewLockZero} setOpen={close}>
      <NewLockZeroModalContent icon={'ZERO'} />
    </BasicModal>
  );
};
