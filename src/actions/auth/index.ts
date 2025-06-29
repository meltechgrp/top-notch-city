import {
	AuthLoginInput,
	AuthLoginSchema,
	AuthSignupInput,
	AuthSignupSchema,
} from '@/lib/schema';
import { Fetch } from '../utills';

export async function authLogin(
	form: AuthLoginInput
): Promise<ActionResponse<AuthLoginInput>> {
	try {
		const parsed = AuthLoginSchema.safeParse(form);
		if (!parsed.success) {
			const err = parsed.error.flatten();
			return {
				fieldError: {
					email: err.fieldErrors.email?.[0],
					password: err.fieldErrors.password?.[0],
				},
			};
		}
		const res = await Fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(form),
		});
		const data = await res.json();
		console.log(data);
		if (data.detail) {
			return {
				formError: 'Please check your details',
			};
		} else {
			return {
				data: {
					message: data?.message ?? 'Registration successful',
					access_token: data?.access_token,
				},
			};
		}
	} catch (error) {
		console.log(error);
		return {
			formError: 'Something went wrong try ',
		};
	}
}

export async function authSignup(
	form: AuthSignupInput
): Promise<ActionResponse<AuthSignupInput>> {
	try {
		const formData = new FormData();
		const parsed = AuthSignupSchema.safeParse(form);
		if (!parsed.success) {
			const err = parsed.error.flatten();
			return {
				fieldError: {
					email: err.fieldErrors.email?.[0],
					password: err.fieldErrors.password?.[0],
					first_name: err.fieldErrors.first_name?.[0],
					last_name: err.fieldErrors.last_name?.[0],
					comfirmPassword: err.fieldErrors.comfirmPassword?.[0],
				},
			};
		}
		const { email, password, comfirmPassword, first_name, last_name } = form;
		if (password !== comfirmPassword) {
			return {
				formError: 'Passwords do not match!',
			};
		}
		Object.entries(form).map(([key, val]) => {
			formData.append(key, val);
		});
		const res = await Fetch('/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				first_name,
				last_name,
				password,
			}),
		});
		const data = await res.json();
		console.log(data);
		if (data.detail) {
			data.detail?.map((item: any) => {
				console.log(item);
			});
			return {
				formError: 'Please check your details',
			};
		} else {
			return {
				data: {
					message: data?.message ?? 'Registration successful',
					access_token: data?.access_token,
				},
			};
		}
	} catch (error) {
		console.log(error);
		return {
			formError: 'Something went wrong try ',
		};
	}
}

export async function authOptVerify({
	otp,
	email,
}: {
	otp: string;
	email: string;
}): Promise<ActionResponse<AuthLoginInput>> {
	try {
		const res = await Fetch(`/verify-email?code=${otp}&email=${email}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await res.json();
		console.log(data);
		if (data?.detail) {
			return {
				formError: 'Please verify your OTP code',
			};
		}
		if (data?.message == 'Email verified successfully.') {
			return {
				data: data.message,
			};
		} else {
			return {
				formError: data.message ?? 'Please verify your OTP code',
			};
		}
	} catch (error) {
		console.log(error);
		return {
			formError: 'Something went wrong try ',
		};
	}
}

export async function sendPasswordReset({ email }: { email: string }) {
	const res = await Fetch('/password-reset/request', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email }),
	});
	const data = await res.json();
	console.log(data);
	if (!res.ok) throw new Error('Failed to send password reset code');
	if (data?.detail) {
		throw new Error('Error occurried');
	}
	return true;
}
export async function resendVerificationCode({ email }: { email: string }) {
	const res = await Fetch('/resend-verification-code', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email }),
	});
	const data = await res.json();
	console.log(data);
	if (!res.ok) throw new Error('Failed to send resend verification code');
	if (data?.detail) {
		throw new Error('Error occurried');
	}
	return true;
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
	const res = await Fetch('/password-reset/confirm', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, code, new_password, confirm_password }),
	});
	const data = await res.json();
	console.log(data);
	if (!res.ok) throw new Error('Failed to send reset password');
	return data;
}
export async function loginWithSocial({
	email,
	first_name,
	last_name,
}: {
	email: string;
	last_name: string;
	first_name: string;
}) {
	try {
		const res = await Fetch('/social-login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, last_name, first_name }),
		});
		const data = await await res.json();
		console.log(data);
		if (!res.ok) throw new Error('Failed to login');
		return data;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to login');
	}
}
