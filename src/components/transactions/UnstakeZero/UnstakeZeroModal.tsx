import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { UnstakeZeroModalContent } from './UnstakeZeroModalContent';

export const UnstakeZeroModal = () => {
  const { type, close, args } = useModalContext();

  return (
    <BasicModal open={type === ModalType.UnstakeZero} setOpen={close}>
      <UnstakeZeroModalContent icon={'Zero'} lockId={args.nftId || 0} />
    </BasicModal>
  );
};
