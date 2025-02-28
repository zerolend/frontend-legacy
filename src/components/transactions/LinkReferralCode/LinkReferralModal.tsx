import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { LinkReferralModalContent } from './LinkReferralModalContent';
import { useRootStore } from '../../../store/root';
import Router from 'next/router';

export const LinkReferralModal = () => {
  const { type, close, args } = useModalContext();
  const setInvite = useRootStore.getState().setInvite;

  const handleClose = () => {
    localStorage.setItem('invite', '');
    setInvite('');
    Router.push({
      pathname: '/gravity',
    },
      undefined, { shallow: true }
    )
    close();
  }

  return (
    <BasicModal open={type === ModalType.LinkReferralCode} setOpen={handleClose}>
      <LinkReferralModalContent
        inviteReferrerCode={args.referrerCode || ''}
        setOpen={close}
      />
    </BasicModal>
  );
};
