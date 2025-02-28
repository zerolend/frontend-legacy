import React from 'react';
import { ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { StakeVestModalContent } from './StakeVestModalContent';
import { GetUserVestingData } from 'src/contract-helpers/types';

export const StakeVestModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    vest: GetUserVestingData;
  }>;

  return (
    <BasicModal open={type === ModalType.StakeVest} setOpen={close}>
      <StakeVestModalContent vest={args.vest} icon="ZERO" />
    </BasicModal>
  );
};
