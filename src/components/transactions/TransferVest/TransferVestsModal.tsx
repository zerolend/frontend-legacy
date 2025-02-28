import React from 'react';
import { ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { TransferVestModalContent } from './TransferVestModalContent';

export const TransferVestsModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    vestId: number;
  }>;

  return (
    <BasicModal open={type === ModalType.TransferVest} setOpen={close}>
      <TransferVestModalContent vestId={args.vestId} />
    </BasicModal>
  );
};
