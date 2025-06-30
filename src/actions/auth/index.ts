import {
	AuthLoginInput,
	validateEmail,
} from '@/lib/schema';
import { Fetch } from '../utills';

export async function authOptVerify({
	otp,
	email,
}: {
	otp: string;
	email: string;
}): Promise<ActionResponse<AuthLoginInput>> {
	try {
		const data = await Fetch(`/verify-email?code=${otp}&email=${email}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
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

export async function resendVerificationCode({ email }: { email: string }) {
	const data = await Fetch('/resend-verification-code', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		data: JSON.stringify({ email }),
	});
	if (data?.detail) {
		throw new Error('Error occurried');
	}
	return true;
}
export async function loginWithSocial({
	email,
	first_name,
	last_name,
}: {
	email: string;
	last_name?: string;
	first_name?: string;
}) {
	try {
		const parsed = validateEmail.safeParse(email);
		if (!parsed.success) {
			 throw new Error('Please enter a valid email address');
		}
		const data = await Fetch('/social-login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.stringify({ email, last_name, first_name }),
		});
		if (data?.detail) {
			throw new Error('Please check your details');
		}
		return data;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to login');
	}
}
