import { useEffect, useState } from 'react';
import eventBus from '@/lib/eventBus';
import SignInBottomSheet from '../modals/auth/SignInBottomSheet';
import VerifyOtpBottomSheet from '../modals/auth/VerifyOptBottomSheet';
import SignUpBottomSheet from '../modals/auth/SignupBottomSheet';

export default function AuthModals() {
  const [signIn, setSignIn] = useState<AuthModalProps | null>(null);
  const [signUp, setSignUp] = useState<AuthModalProps | null>(null);
  const [emailVerification, setEmailVerification] = useState<AuthModalProps | null>(null);

  useEffect(() => {
    eventBus.addEventListener('openSignInModal', setSignIn);
    eventBus.addEventListener('openSignUpModal', setSignUp);
    eventBus.addEventListener('openEmailVerificationModal', setEmailVerification);
  }, []);

  return (
    <>
      {!!signIn && (
        <SignInBottomSheet
          {...signIn}
          onDismiss={() => {
            signIn.onDismiss?.();
            setSignIn(null);
          }}
        />
      )}
      {!!signUp && (
        <SignUpBottomSheet
          {...signUp}
          onDismiss={() => {
            signUp.onDismiss?.();
            setSignUp(null);
          }}
        />
      )}
      {!!emailVerification && (
        <VerifyOtpBottomSheet
          {...emailVerification}
          onDismiss={() => {
            emailVerification.onDismiss?.();
            setEmailVerification(null);
          }}
        />
      )}
    </>
  );
}


export function openSignInModal(props: AuthModalProps) {
  eventBus.dispatchEvent('openSignInModal', props);
}

export function openSignUpModal(props: AuthModalProps) {
  eventBus.dispatchEvent('openSignUpModal', props);
}

export function openResetPasswordModal(props: AuthModalProps) {
  eventBus.dispatchEvent('openResetPasswordModal', props);
}

export function openEmailVerificationModal(props: AuthModalProps) {
  eventBus.dispatchEvent('openEmailVerificationModal', props);
}

export function closeAuthModals() {
  eventBus.dispatchEvent('openSignInModal', null);
  eventBus.dispatchEvent('openSignUpModal', null);
  eventBus.dispatchEvent('openResetPasswordModal', null);
  eventBus.dispatchEvent('openEmailVerificationModal', null);
}
