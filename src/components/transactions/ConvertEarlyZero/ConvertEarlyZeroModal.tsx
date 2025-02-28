import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { ConvertEarlyZeroModalContent } from './ConvertEarlyZeroModalContent';

export const ConvertEarlyZero = () => {
  const { type, close, args } = useModalContext();
  return (
    <BasicModal open={type === ModalType.ConvertEZero} setOpen={close}>
      <ConvertEarlyZeroModalContent
        icon={'ZERO'}
        merkleData={args.merkleData}
        isClaimed={args.isClaimed}
      />
    </BasicModal>
  );
};
