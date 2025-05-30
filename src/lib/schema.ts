import { z } from 'zod';

export const validateEmail = z.string().email({
	message: 'Enter a valid email address',
});

export const validatePassword = z
	.string()
	.min(8, 'Password is too short. Minimum 8 characters required.')
	.max(50, 'Password is too long. Maximum 50 characters required.');

export const Name = z.string().min(3, {
	message: 'Enter a valid name',
});

export const phone = z.string().min(10, {
	message: 'Please enter a valid phone number.',
});
export const AuthLoginSchema = z.object({
	email: validateEmail,
	password: validatePassword,
});
export type AuthLoginInput = z.infer<typeof AuthLoginSchema>;

export const AuthSignupSchema = z.object({
	email: validateEmail,
	password: validatePassword,
	first_name: Name,
	last_name: Name,
	comfirmPassword: validatePassword,
});

export type AuthSignupInput = z.infer<typeof AuthSignupSchema>;

export const UpdateUserSchema = z.object({
	email: validateEmail,
	first_name: Name,
	last_name: Name,
	phone: phone,
	street: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	country: z.string().optional(),
	country_code: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const mediaFileSchema = z.object({
	uri: z.string().url(),
	id: z.string(),
});

export const PropertySchema = z.object({
	title: z.string().min(3, {
		message: 'Enter a valid title',
	}),
	description: z.string().optional(),
	price: z.string().min(2, {
		message: 'Enter a valid price',
	}),
	subcategory: z.string().min(3, {
		message: 'Select a Sub Category',
	}),
	category: z.string().min(3, {
		message: 'Select a Category',
	}),
	purpose: z.string().min(3, {
		message: 'Enter a valid name',
	}),
	street: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	place_id: z.string().optional(),
	country: z.string().optional(),
	country_code: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	images: z
		.array(mediaFileSchema)
		.min(3, {
			message: 'Add at least 3 property images',
		})
		.max(15, {
			message: 'Maximum of 15 images only!',
		}),
	videos: z
		.array(mediaFileSchema)
		.max(5, {
			message: 'Maximum of 5 videos only!',
		})
		.optional(),
});

export type PropertyInput = z.infer<typeof PropertySchema>;
