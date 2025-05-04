import config from '@/config';
import { getAuthToken, removeAuthToken } from '@/lib/secureStore';
import { createClient } from 'graphql-ws';
import {
	ApolloClient,
	createHttpLink,
	InMemoryCache,
	NormalizedCacheObject,
	split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { setContext } from '@apollo/client/link/context';
import { getUniqueIdSync } from 'react-native-device-info';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { persistCache } from 'apollo3-cache-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
class TimeoutError extends Error {
	super(message: string) {
		this.message = message;
	}
}

const DEFAULT_TIMEOUT = 15000;

function fetchWithTimeout(
	uri: URL | RequestInfo,
	options: RequestInit = {},
	timeoutMs: number
): Promise<Response> {
	return new Promise((resolve, reject) => {
		const controller = new AbortController();
		const timer = setTimeout(() => {
			controller.abort(new TimeoutError('Request timed out.'));
			reject(new TimeoutError('Request timed out.'));
		}, timeoutMs);

		fetch(uri, {
			...options,
			signal: controller.signal,
		}).then(
			(response) => {
				clearTimeout(timer);
				resolve(response);
			},
			(err) => {
				clearTimeout(timer);
				reject(err);
			}
		);
	});
}

export function createApolloClient() {
	let client: ApolloClient<NormalizedCacheObject>;

	let activeSocket: any, timedOut: string | number | NodeJS.Timeout | undefined;
	console.log('config.origin', config.origin);

	const httpLink = createHttpLink({
		uri: `${config.origin}/graphql`,
		fetch: (uri, options) => {
			// we can pass custom timeout value for an operation
			const timeoutFromHeader =
				options?.headers?.['x-timeout'] || DEFAULT_TIMEOUT;
			return fetchWithTimeout(uri, options, timeoutFromHeader);
		},
	});

	const wsLink = new GraphQLWsLink(
		createClient({
			url: `${config.origin.replace('http', 'ws')}/subscriptions`,
			retryAttempts: Infinity,
			shouldRetry: () => true,
			keepAlive: 10000,
			retryWait: async function waitForServerHealthyBeforeRetry() {
				const milliseconds = 1000 + Math.random() * 3000;
				console.log(`Waiting ${milliseconds}ms before retrying...`);
				await new Promise((resolve) => setTimeout(resolve, milliseconds));
			},
			async connectionParams() {
				const authToken = getAuthToken();
				const deviceId = getUniqueIdSync();
				if (!authToken) {
					return {
						deviceId,
					};
				}
				return {
					authToken,
					did: deviceId,
				};
			},

			on: {
				connected: (socket) => {
					activeSocket = socket; // to be used at pings & pongs
				},
				ping: (received) => {
					if (!received)
						// sent
						timedOut = setTimeout(() => {
							if (activeSocket?.readyState === WebSocket?.OPEN)
								activeSocket?.close(4408, 'Request Timeout');
						}, 5000); // wait 5 seconds for the pong and then close the connection
				},
				pong: (received) => {
					if (received) clearTimeout(timedOut); // pong is received, clear connection close timeout
				},
				error: (error) => {
					console.dir(error);
					console.log('error', error);
				},
				closed: () => {
					console.log('closed');
				},
			},
		})
	);
	const splitLink = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === 'OperationDefinition' &&
				definition.operation === 'subscription'
			);
		},
		wsLink,
		httpLink
	);

	const authLink = setContext(async (_, { headers }) => {
		const authToken = getAuthToken();
		const deviceId = getUniqueIdSync();
		// return the headers to the context so httpLink can read them
		return {
			headers: {
				...headers,
				...(authToken ? { authorization: `Bearer ${authToken}` } : {}),
				// device id
				'X-DID': deviceId,
			},
		};
	});
	const errorLink = onError(({ networkError }) => {
		const authToken = getAuthToken();
		// @ts-ignore
		if (
			networkError &&
			networkError.name === 'ServerError' &&
			'statusCode' in networkError &&
			networkError?.statusCode === 401 &&
			authToken
		) {
			// remove cached token on 401 from the server
			removeAuthToken();
		}

		if (networkError instanceof TimeoutError) {
			console.log('operation timeout!');
		}
	});

	const authFlowLink = authLink.concat(errorLink);
	const cache = new InMemoryCache({});
	persistCache({
		cache,
		storage: AsyncStorage,
	});
	client = new ApolloClient({
		link: authFlowLink.concat(splitLink),
		cache,
	});

	return client;
}

export default createApolloClient();
