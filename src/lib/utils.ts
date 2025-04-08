import { format, isThisYear, isToday } from 'date-fns';
import { Linking } from 'react-native';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const notEmpty = (v: any) => v !== '';
function* _range(length: number) {
	for (let index = 0; index < length; index++) {
		yield index;
	}
}
export const range = (length: number) => Array.from(_range(length));
export function imageRatio(h: number, w: number, maxWidth: number) {
	let ratio = 7 / 16;
	let height = Math.round(maxWidth / ratio);
	height = height > h ? h : height;
	let width = Math.round(w > maxWidth ? maxWidth : w);
	return { width, height };
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
export function* dateRange(end = 1970) {
	let current = new Date().getFullYear();
	while (current >= end) {
		yield current;
		current--;
	}
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

export function greet(): string {
	const currentHour = new Date().getHours();

	if (currentHour >= 5 && currentHour < 12) {
		return 'Good morning';
	} else if (currentHour >= 12 && currentHour < 17) {
		return 'Good afternoon';
	} else if (currentHour >= 17 && currentHour < 21) {
		return 'Good evening';
	} else {
		return 'Good night';
	}
}

export async function waiter(exp: () => Promise<boolean>, delay = 3000) {
	while (!(await exp())) {
		await wait(delay);
	}
}
async function wait(delay: number) {
	return new Promise((res) => setTimeout(res, delay));
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

export function validatePhoneNumber(number: string, countryCode: string) {
	switch (countryCode) {
		case 'NG':
			return number.startsWith('0')
				? number.length === 11
				: number.length === 10;
		case 'US':
			return number.length === 10;

		default:
			return false;
	}
}

// pluralize a word based on a number
export function pluralize(word: string, count: number) {
	return count === 1 ? word : word + 's';
}

export function cleanPrice(v: string) {
	return +(v + '').split(',').join('') || 0;
}

// fullName of a user
export function fullName(user: any) {
	return !user?.firstName ? '' : `${user.firstName} ${user.lastName}`;
}
// delivery location
export function deliveryLocation(zone: any /**Partial<CourierDeliveryZone>*/) {
	return `${zone?.city} - ${zone?.state}`;
}

export function formatBillingCycle(n: number) {
	if (n < 12) {
		return `${n} ${n === 1 ? 'month' : 'months'}`;
	}
	return `${Math.floor(n / 12)} ${Math.floor(n / 12) === 1 ? 'year' : 'years'}`;
}

export function formatDayCount(days: number) {
	return `${days} ${days === 1 ? 'day' : 'days'}`;
}

export function guidGenerator() {
	const S4 = () =>
		(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	return (
		S4() +
		S4() +
		'-' +
		S4() +
		'-' +
		S4() +
		'-' +
		S4() +
		'-' +
		S4() +
		S4() +
		S4()
	);
}

export function scaleImageHeight(h: number, w: number, maxWidth: number) {
	let ratio = w / h;
	const nH = Math.round(maxWidth / ratio);
	let newH = nH > h ? h : nH;

	if (w < maxWidth) {
		return {
			width: maxWidth,
			height: maxWidth,
		};
	}
	return {
		width: w > maxWidth ? maxWidth : w,
		height: newH,
	};
}

// format a date based on distance, e.g. "2 days ago"
export function formatDateDistance(date: string) {
	const seconds = Math.floor(
		(new Date().getTime() - new Date(date).getTime()) / 1000
	);
	let interval = Math.floor(seconds / 31536000);
	if (interval > 1) {
		return `${interval}y ago`;
	}

	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return `${interval}d ago`;
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return `${interval}h ago`;
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return `${interval}m ago`;
	}
	return `${Math.floor(seconds)}s ago`;
}

export function isText(text: any) {
	return (
		['string', 'number', 'undefined'].includes(typeof text) || text === null
	);
}

// ensure no duplicate in an array with a given key while preserving order
export function deduplicate<T>(arr: T[], key: keyof T) {
	const map = new Map();
	arr.forEach((v) => {
		map.set(v[key], v);
	});
	return Array.from(map.values());
}

export function isValidEmailByRegex(email: string | undefined) {
	if (!email) return false;

	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	const isValidEmailByRegex = emailRegex.test(email);

	return isValidEmailByRegex;
}

type ComposerAddress = {
	street?: string | null;
	streetNumber?: string | null;
	community?: string | null;
	neighborhood?: string | null;
	lga?: string | null;
	state?: string | null;
	country?: string | null;
};

function joinWithComma(...arr: Array<string | undefined | null>) {
	return arr.filter(Boolean).join(', ').trim();
}

/**
 * Generates the ordinal representation of a number. e.g 1 -> 1st, 2 -> 2nd, etc.
 *
 * @param {any} n - the number to generate the ordinal representation for
 * @return {any} the ordinal representation of the input number
 */
export function ordinal(n: number): string {
	return n + ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
}

export function calculateNewDimensions(
	width: number,
	height: number,
	MAX_WIDTH: number,
	MAX_HEIGHT: number
) {
	let newWidth = width;
	let newHeight = height;

	const aspectRatio = width / height || 1;

	// Adjust width if it exceeds MAX_WIDTH
	if (width > MAX_WIDTH) {
		newWidth = MAX_WIDTH;
		newHeight = MAX_WIDTH / aspectRatio;
	}

	// Adjust height if it exceeds MAX_HEIGHT
	if (newHeight > MAX_HEIGHT) {
		newHeight = MAX_HEIGHT;
		newWidth = MAX_HEIGHT * aspectRatio;
	}
	if (newWidth < MAX_WIDTH) {
		newWidth = MAX_WIDTH;
		newHeight = newWidth / aspectRatio;
	}
	return { width: Math.round(newWidth), height: Math.round(newHeight) };
}

export function isDeadlineElapsed(deadline: Date): boolean {
	const currentTime = new Date();
	return currentTime > deadline;
}

export function openExternalLink(url: string) {
	// TODO: Use url shortener to shorten the url and track clicks
	Linking.openURL(url);
}

export function parseInternalLink(url: string) {
	try {
		const _url = new URL(url);
		const supportedHostnames = ['lifesync.com'];
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

// ! copy of tokenization code from backend. Might get out of sync
export function tokenizeText(text: string) {
	const tokens: { type: string; value: string }[] = [];
	// Split by spaces and line breaks
	const textArray = text.split(/(\s+|\n)/);
	// URL regex, matches http(s)://www.example.com, (www.|*)example.com and http(s)://example.com
	const urlRegex = /((https?:\/\/)?(www\.)?[\w-]+\.\w{2,3}\S*)/g;
	for (const word of textArray) {
		if (word.match(/^\s+$/)) {
			tokens.push({ type: 'text', value: word });
		} else if (word.startsWith('c/')) {
			tokens.push({ type: 'community', value: word });
		} else if (word.startsWith('s/')) {
			tokens.push({ type: 'split', value: word });
		} else if (word.startsWith('@')) {
			tokens.push({ type: 'mention', value: word });
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

export function mToKm(metres: number) {
	return metres / 1000;
}

export function degreesToRadians(degrees: number) {
	return degrees * (Math.PI / 180);
}

export function formatPhoneNumber(phoneNumber: string) {
	const cleaned = phoneNumber.replace(/\D/g, '');

	if (cleaned.length < 7) return phoneNumber;

	const firstPart = cleaned.slice(0, cleaned.length - 3);
	const secondPart = cleaned.slice(cleaned.length - 3);

	const groupedFirstPart = firstPart.match(/.{1,4}/g)?.join(' ') || firstPart;

	return `${groupedFirstPart} ${secondPart}`;
}

type TextSegment = {
	text: string;
	isHighlighted: boolean;
};

export function segmentTextForHighlighting(
	text: string,
	searchTerm: string | undefined
): TextSegment[] {
	const regex = new RegExp(`(${searchTerm || ''})`, 'i');
	return text
		.split(regex)
		.filter(Boolean) // Filters out empty strings
		.map((segment) => ({
			text: segment,
			isHighlighted: segment.toLowerCase() === searchTerm?.toLowerCase(),
		}));
}
