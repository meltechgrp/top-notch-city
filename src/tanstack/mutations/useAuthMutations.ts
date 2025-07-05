import { useMutation } from "@tanstack/react-query";
import {
  authLogin,
  authSignup,
  authOptVerify,
  resendVerificationCode,
} from "@/actions/auth";

export function useAuthMutations() {
  const loginMutation = useMutation({
    mutationFn: authLogin,
  });

  const signupMutation = useMutation({
    mutationFn: authSignup,
  });

  const otpVerifyMutation = useMutation({
    mutationFn: authOptVerify,
  });

  const resendVerificationMutation = useMutation({
    mutationFn: resendVerificationCode,
  });

  // const sendPasswordResetMutation = useMutation({
  // 	mutationFn: sendPasswordReset,
  // });

  // const resetPasswordMutation = useMutation({
  // 	mutationFn: resetPassword,
  // });

  return {
    loginMutation,
    signupMutation,
    otpVerifyMutation,
    resendVerificationMutation,
    // sendPasswordResetMutation,
    // resetPasswordMutation,
  };
}
