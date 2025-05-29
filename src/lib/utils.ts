import { format, isThisYear, isToday } from 'date-fns';
import { Linking } from 'react-native';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';
import eventBus from './eventBus';

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

// show snackbar message
export function showSnackbar(option: SnackBarOption) {
	eventBus.dispatchEvent('addSnackBar', option);
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
	return !user?.first_name ? '' : `${user.first_name} ${user.last_name}`;
}

export function mToKm(metres: number) {
	return metres / 1000;
}

export function isText(text: any) {
	return (
		['string', 'number', 'undefined'].includes(typeof text) || text === null
	);
}

export function composeFullAddress(
	address: ParsedAddress,
	streetOnly?: boolean
) {
	if (streetOnly) {
		return address?.street?.trim();
	}
	if (!address.street) {
		return joinWithComma(
			address.city,
			address.lga,
			address.state,
			address.country
		);
	}
	return joinWithComma(
		address.street,
		address.city,
		address.lga,
		address.state,
		address.country
	);
}
export function joinWithComma(...arr: Array<string | undefined | null>) {
	return arr.filter(Boolean).join(', ').trim();
}

export function tokenizeText(text: string) {
	const tokens: { type: string; value: string }[] = [];
	// Split by spaces and line breaks
	const textArray = text.split(/(\s+|\n)/);
	// URL regex, matches http(s)://www.example.com, (www.|*)example.com and http(s)://example.com
	const urlRegex = /((https?:\/\/)?(www\.)?[\w-]+\.\w{2,3}\S*)/g;
	for (const word of textArray) {
		if (word.match(/^\s+$/)) {
			tokens.push({ type: 'text', value: word });
		} else if (word.match(urlRegex)) {
			// TODO: Check internal links
			tokens.push({ type: 'link', value: word });
		} else if (word.startsWith('#')) {
			tokens.push({ type: 'tag', value: word });
		} else {
			tokens.push({ type: 'text', value: word });
		}
	}
	// Collapse consecutive text tokens
	const collapsedTokens: { type: string; value: string }[] = [];
	for (const token of tokens) {
		if (collapsedTokens.length === 0) {
			collapsedTokens.push(token);
		} else {
			const lastToken = collapsedTokens[collapsedTokens.length - 1];
			if (lastToken.type === 'text' && token.type === 'text') {
				lastToken.value += token.value;
			} else {
				collapsedTokens.push(token);
			}
		}
	}

	return collapsedTokens;
}

export function openExternalLink(url: string) {
	// TODO: Use url shortener to shorten the url and track clicks
	Linking.openURL(url);
}

export function parseInternalLink(url: string) {
	try {
		const _url = new URL(url);
		const supportedHostnames = ['mynebor.com'];
		const isSupportedHostname = supportedHostnames.some(
			(h) => _url.hostname === h
		);
		const supportedPaths = ['/c/', '/s/'];
		const isSupportedPath = supportedPaths.some((p) =>
			_url.pathname.startsWith(p)
		);

		if (isSupportedPath && isSupportedHostname) {
			return _url.pathname;
		} else {
			return null;
		}
	} catch {
		return null;
	}
}
