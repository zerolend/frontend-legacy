import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { LockLPModalContent } from './LockLPModalContent';

export const LockLPModal = () => {
  const { type, close } = useModalContext();
  return (
    <BasicModal open={type === ModalType.LockLP} setOpen={close}>
      <LockLPModalContent icon={'ETH/ZERO'} />
    </BasicModal>
  );
};
