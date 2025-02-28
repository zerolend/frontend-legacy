import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { ClaimZEROLockerIncentivesContent } from './ClaimZEROLockerIncentivesContent';

export const ClaimZEROLockerIncentivesModal = () => {
  const { type, close, args } = useModalContext();
  return (
    <BasicModal open={type === ModalType.ClaimZEROLockerIncentives} setOpen={close}>
      <ClaimZEROLockerIncentivesContent amount={args.amount || ''} />
    </BasicModal>
  );
};
