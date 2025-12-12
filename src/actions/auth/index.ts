import {
  AuthLoginInput,
  AuthLoginSchema,
  AuthSignupInput,
  AuthSignupSchema,
  validateEmail,
} from "@/lib/schema";
import { Fetch } from "../utills";
import config from "@/config";

export async function authOptVerify({
  otp,
  email,
}: {
  otp: string;
  email: string;
}): Promise<ActionResponse<AuthLoginInput>> {
  try {
    const data = await Fetch(`/verify-email?code=${otp}&email=${email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (data?.detail) {
      return {
        formError: "Please verify your OTP code",
      };
    }
    if (data?.message == "Email verified successfully.") {
      return {
        data: data.message,
      };
    } else {
      return {
        formError: data.message ?? "Please verify your OTP code",
      };
    }
  } catch (error) {
    return {
      formError: "Something went wrong try ",
    };
  }
}

export async function resendVerificationCode({ email }: { email: string }) {
  const data = await Fetch("/resend-verification-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ email }),
  });
  if (data?.detail) {
    throw new Error("Error occurried");
  }
  return true;
}
export async function loginWithSocial({
  provider,
  token,
}: {
  provider: string;
  token: string;
}) {
  try {
    const data = await Fetch("/apple/social-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ provider, token }),
    });
    if (data?.detail) {
      throw new Error("Please check your details");
    }
    return data;
  } catch (error) {
    throw new Error("Failed to login");
  }
}

export async function authSignup(
  form: AuthSignupInput
): Promise<ActionResponse<AuthSignupInput>> {
  try {
    const parsed = AuthSignupSchema.safeParse(form);
    if (!parsed.success) {
      const err = parsed.error.flatten();
      return {
        fieldError: {
          email: err.fieldErrors.email?.[0],
          password: err.fieldErrors.password?.[0],
          first_name: err.fieldErrors.first_name?.[0],
          last_name: err.fieldErrors.last_name?.[0],
          confirmPassword: err.fieldErrors.confirmPassword?.[0],
        },
      };
    }
    const { email, password, confirmPassword, first_name, last_name } = form;
    if (password !== confirmPassword) {
      return {
        formError: "Passwords do not match!",
      };
    }
    const res = await fetch(`${config.origin}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        first_name,
        last_name,
        password,
      }),
    });
    const data = await res.json();
    if (data.detail) {
      data.detail?.map((item: any) => {});
      return {
        formError: "Please check your details",
      };
    } else {
      return {
        data: {
          message: data?.message ?? "Registration successful",
          access_token: data?.access_token,
        },
      };
    }
  } catch (error) {
    return {
      formError: "Something went wrong try ",
    };
  }
}

export async function authLogin(
  form: AuthLoginInput
): Promise<ActionResponse<AuthLoginInput>> {
  try {
    const parsed = AuthLoginSchema.safeParse(form);
    if (!parsed.success) {
      const err = parsed.error.flatten().fieldErrors;
      return {
        formError: err.email?.[0] || err.password?.[0],
      };
    }
    const data = await fetch(`${config.origin}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const res = await data.json();

    if (res.detail) {
      return {
        formError: "Incorrect Email or Password",
      };
    } else {
      return {
        data: {
          message: res?.message ?? "Registration successful",
          access_token: res?.access_token,
        },
      };
    }
  } catch (error) {
    return {
      formError: "Something went wrong try ",
    };
  }
}
export async function sendPasswordReset({ email }: { email: string }) {
  try {
    const data = await fetch(`${config.origin}/api/password-reset/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const res = await data.json();

    if (res.detail) {
      return {
        formError: "Email not found",
      };
    } else {
      return {
        success: true,
      };
    }
  } catch (error) {
    throw Error("error");
  }
}
export async function resetPassword({
  email,
  code,
  confirm_password,
  new_password,
}: {
  email: string;
  code: string;
  new_password: string;
  confirm_password: string;
}) {
  try {
    const data = await fetch(`${config.origin}/api/password-reset/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        code,
        new_password,
        confirm_password,
      }),
    });
    const res = await data.json();
    console.log(res);
    if (res?.detail) {
      throw new Error("Error occurried");
    }
    return res;
  } catch (error) {
    throw Error("error");
  }
}
