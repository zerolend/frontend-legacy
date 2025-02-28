import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { LockedDLPModalContent } from './LockedDLPModalContent';

export const LockedDLPModal = () => {
  const { type, close } = useModalContext();
  return (
    <BasicModal open={type === ModalType.LockedDLP} setOpen={close}>
      <LockedDLPModalContent icon={'ETH'} />
    </BasicModal>
  );
};
