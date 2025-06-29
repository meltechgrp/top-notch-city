import { useEffect, useState } from 'react';
import eventBus from '@/lib/eventBus';
import SignInBottomSheet from '../modals/auth/SignInBottomSheet';
import NewPasswordBottomSheet from '../modals/auth/NewPasswordBottomSheet';
import VerifyOtpBottomSheet from '../modals/auth/VerifyOptBottomSheet';
import ResetPasswordBottomSheet from '../modals/auth/ResetPassword';
import SignUpBottomSheet from '../modals/auth/SignupBottomSheet';

export default function AuthModals() {
  const [signIn, setSignIn] = useState<AuthModalProps | null>(null);
  const [signUp, setSignUp] = useState<AuthModalProps | null>(null);
  const [resetPassword, setResetPassword] = useState<AuthModalProps | null>(null);
  const [emailVerification, setEmailVerification] = useState<AuthModalProps | null>(null);

  useEffect(() => {
    eventBus.addEventListener('openSignIn', setSignIn);
    eventBus.addEventListener('openSignUp', setSignUp);
    eventBus.addEventListener('openResetPassword', setResetPassword);
    eventBus.addEventListener('openEmailVerification', setEmailVerification);
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
      {!!resetPassword && (
        <ResetPasswordBottomSheet
          {...resetPassword}
          onDismiss={() => {
            resetPassword.onDismiss?.();
            setResetPassword(null);
          }}
        />
      )}
      {!!resetPassword && (
        <NewPasswordBottomSheet
          {...resetPassword}
          onDismiss={() => {
            resetPassword.onDismiss?.();
            setResetPassword(null);
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


export function openSignIn(props: AuthModalProps) {
  eventBus.dispatchEvent('openSignIn', props);
}

export function openSignUp(props: AuthModalProps) {
  eventBus.dispatchEvent('openSignUp', props);
}

export function openResetPassword(props: AuthModalProps) {
  eventBus.dispatchEvent('openResetPassword', props);
}

export function openEmailVerification(props: AuthModalProps) {
  eventBus.dispatchEvent('openEmailVerification', props);
}

export function closeAuthModals() {
  eventBus.dispatchEvent('openSignIn', null);
  eventBus.dispatchEvent('openSignUp', null);
  eventBus.dispatchEvent('openResetPassword', null);
  eventBus.dispatchEvent('openEmailVerification', null);
}
