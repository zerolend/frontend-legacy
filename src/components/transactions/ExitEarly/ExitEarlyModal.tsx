import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { ExitEarlyModalContent } from './ExitEarlyModalContent';

export const ExitEarlyModal = () => {
  const { type, close, args } = useModalContext();

  return (
    <BasicModal open={type === ModalType.ExitEarly} setOpen={close}>
      <ExitEarlyModalContent vest={args.vest} icon="ZERO" />
    </BasicModal>
  );
};
