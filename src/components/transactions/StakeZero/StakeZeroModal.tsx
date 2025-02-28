import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { StakeZeroModalContent } from './StakeZeroModalContent';

export const StakeZeroModal = () => {
  const { type, close, args } = useModalContext();

  return (
    <BasicModal open={type === ModalType.StakeZERO} setOpen={close}>
      <StakeZeroModalContent icon={'Zero'} nftId={args.nftId || 0} />
    </BasicModal>
  );
};
