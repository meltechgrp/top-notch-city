import { format, isThisYear, isToday } from 'date-fns';
import { Linking } from 'react-native';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getHeight(width: number, ratio = 7 / 16) {
	return Math.round(width * ratio);
}
export function convertToFile(uri: string) {
	let filename = uri.split('/').pop();
	if (filename) {
		let match = /\.(\w+)$/.exec(filename);
		let type = match ? `image/${match[1]}` : `image`;
		//@ts-ignore
		return { uri, name: filename, type } as Blob;
	}
	return null;
}
export function useLazyApiQuery<F extends (...args: any) => Promise<any>>(
	fn: F
) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState<Awaited<ReturnType<F>> | null>(null);
	function query(...arg: Parameters<F>) {
		setLoading(true);
		return fn(...arg)
			.finally(() => {
				setLoading(false);
			})
			.then(setData)
			.catch(setError);
	}

	return [query, { loading, error, data }] as const;
}

export function useApiQuery<F extends (...args: any) => Promise<any>>(
	fn: F,
	...arg: Parameters<F>
) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [data, setData] = useState<Awaited<ReturnType<F>> | null>(null);

	useEffect(() => {
		fn(...arg)
			.then(setData)
			.catch(setError)
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return { loading, error, data };
}
export function toNaira(amountInKobo: number) {
	return +(amountInKobo / 100).toFixed(2);
}

export function toKobo(amountInNaira: number) {
	return amountInNaira * 100;
}

export function formatToNaira(
	amountInKobo: number,
	fractionDigits: number = 2
) {
	return formatMoney(toNaira(amountInKobo), 'NGN', fractionDigits);
}

export function formatMoney(
	amount: number,
	currency: string,
	fractionDigits: number = 2
) {
	return new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency,
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
		currencyDisplay: 'symbol',
	}).format(amount);
}
export function formatNumber(amount: number = 0) {
	return new Intl.NumberFormat('en-NG').format(amount);
}
export function formatNumberCompact(amount: number = 0) {
	if (amount < 1000) {
		return amount;
	}
	if (amount < 1000000) {
		return `${(amount / 1000).toFixed(1)}K`;
	}
	return `${(amount / 1000000).toFixed(1)}M`;
}

export function ratingToWord(rating: number) {
	if (rating === 0) {
		return '';
	} else if (rating <= 1) {
		return 'poor';
	} else if (rating <= 2) {
		return 'average';
	} else if (rating <= 3) {
		return 'good';
	} else if (rating <= 4) {
		return 'very good';
	}
	return 'excellent';
}

export function formatMessageTime(
	time: Date,
	opt?: { hideTimeForFullDate: boolean }
) {
	let date = new Date(time);
	const { hideTimeForFullDate } = opt || {
		hideTimeForFullDate: false,
	};

	if (isToday(date)) {
		return format(date, 'h:mm a');
	} else if (isThisYear(date)) {
		return format(date, `MMM d${hideTimeForFullDate ? '' : ', h:mm a'}`);
	}
	return format(date, `MM/dd/yyyy${hideTimeForFullDate ? '' : ', h:mm a'}`);
}

// fullName of a user
export function fullName(user: any) {
	return !user?.firstName ? '' : `${user.firstName} ${user.lastName}`;
}

export function mToKm(metres: number) {
	return metres / 1000;
}
