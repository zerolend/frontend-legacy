import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { ClaimLPLockerIncentivesContent } from './ClaimLPLockerIncentivesContent';

export const ClaimLPLockerIncentivesModal = () => {
  const { type, close, args } = useModalContext();
  return (
    <BasicModal open={type === ModalType.ClaimLPLockerIncentives} setOpen={close}>
      <ClaimLPLockerIncentivesContent amount={args.amount || ''} />
    </BasicModal>
  );
};
