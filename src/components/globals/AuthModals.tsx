import { useEffect, useState } from "react";
import eventBus from "@/lib/eventBus";
import SignInBottomSheet from "../modals/auth/SignInBottomSheet";
import VerifyOtpBottomSheet from "../modals/auth/VerifyOptBottomSheet";
import SignUpBottomSheet from "../modals/auth/SignupBottomSheet";
import EnquiriesFormBottomSheet from "../modals/EnquiriesBottomSheet";
import ResetPasswordBottomSheet from "@/components/modals/auth/ResetPasswordBottomSheet";

export default function AuthModals() {
  const [signIn, setSignIn] = useState<AuthModalProps | null>(null);
  const [signUp, setSignUp] = useState<AuthModalProps | null>(null);
  const [enquiry, setEnquiry] = useState<AuthModalProps | null>(null);
  const [resetPassword, setResetPassword] = useState<AuthModalProps | null>(
    null
  );

  const [emailVerification, setEmailVerification] =
    useState<AuthModalProps | null>(null);

  useEffect(() => {
    eventBus.addEventListener("openSignInModal", setSignIn);
    eventBus.addEventListener("openResetPasswordModal", setResetPassword);

    eventBus.addEventListener("openSignUpModal", setSignUp);
    eventBus.addEventListener("openEnquiryModal", setEnquiry);
    eventBus.addEventListener(
      "openEmailVerificationModal",
      setEmailVerification
    );
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
      {!!enquiry && (
        <EnquiriesFormBottomSheet
          {...enquiry}
          onDismiss={() => {
            enquiry.onDismiss?.();
            setEnquiry(null);
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
    </>
  );
}

export function openSignInModal(props: AuthModalProps) {
  eventBus.dispatchEvent("openSignInModal", props);
}

export function openSignUpModal(props: AuthModalProps) {
  eventBus.dispatchEvent("openSignUpModal", props);
}

export function openResetPasswordModal(props: AuthModalProps) {
  eventBus.dispatchEvent("openResetPasswordModal", props);
}
export function openEmailVerificationModal(props: AuthModalProps) {
  eventBus.dispatchEvent("openEmailVerificationModal", props);
}
export function openEnquiryModal(props: AuthModalProps) {
  eventBus.dispatchEvent("openEnquiryModal", props);
}
