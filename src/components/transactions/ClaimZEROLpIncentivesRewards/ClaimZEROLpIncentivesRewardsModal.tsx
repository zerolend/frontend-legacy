import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { ClaimZEROLpIncentivesRewardsContent } from './ClaimZEROLpIncentivesRewardsContent';

export const ClaimZEROLpIncentivesRewardsModal = () => {
  const { type, close } = useModalContext();
  return (
    <BasicModal open={type === ModalType.ClaimZEROLpIncentives} setOpen={close}>
      <ClaimZEROLpIncentivesRewardsContent />
    </BasicModal>
  );
};
