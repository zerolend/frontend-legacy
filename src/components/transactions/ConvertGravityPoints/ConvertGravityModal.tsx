import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { ConvertGravityModalContent } from './ConvertGravityModalContent';

export const ConvertGravityModal = () => {
  const { type, close, args } = useModalContext();
  return (
    <BasicModal open={type === ModalType.ConvertGravity} setOpen={close}>
      <ConvertGravityModalContent
        icon={'ZERO'}
        stakeAssetName={'ZERO'}
        merkleData={args.gravityMerkleData}
      />
    </BasicModal>
  );
};
