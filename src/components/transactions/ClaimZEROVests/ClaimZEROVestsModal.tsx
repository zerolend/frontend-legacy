import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { ClaimZEROVestsContent } from './ClaimZEROVestsContent';

export const ClaimZEROVestsModal = () => {
  const { type, close, args } = useModalContext();
  return (
    <BasicModal open={type === ModalType.ClaimZEROVestsRewards} setOpen={close}>
      <ClaimZEROVestsContent
        vests={args.vests?.filter((data) => !data.claimable.eq(0) && !data.hasPenalty) ?? []}
        vestLoading={args.vestLoading ?? false}
      />
    </BasicModal>
  );
};
