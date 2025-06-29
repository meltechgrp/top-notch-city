import eventBus from '@/lib/eventBus';
import { MMKV } from 'react-native-mmkv';
import * as Crypto from 'expo-crypto'
import { storage } from '@/lib/asyncStorage';

const secureStorage = new MMKV({
	id: 'gDE9BjzFrNneOgVLBQg2hYID2vXzDQBdh2EqJEWrC',
	// Add encryption key to secure storage once this issue is resolved (https://github.com/mrousavy/react-native-mmkv/issues/665)
	// encryptionKey: '01234567890123456789012345678901',
});

// UT = USER TOKEN
export function saveAuthToken(token: string) {
	secureStorage.set('__UT__', token);
	eventBus.dispatchEvent('TOKEN_CHANGE', token);
}

export function hasAuthToken() {
	return !!secureStorage.getString('__UT__');
}

export function getAuthToken() {
	return secureStorage.getString('__UT__');
}

export function removeAuthToken() {
	console.log('removing auth token');
	secureStorage.delete('__UT__');
	storage.clearAll();
	eventBus.dispatchEvent('TOKEN_CHANGE', null);
}

// save app pin code
export async function saveAppPinCode(pinCode: string) {
  // hash pin code
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pinCode
  )
  return secureStorage.set('__APP_PIN_CODE__', hash)
}
// get app pin code
export function getAppPinCode() {
  return secureStorage.getString('__APP_PIN_CODE__')
}
// check if app pin code is set
export function hasAppPinCode() {
  return !!secureStorage.getString('__APP_PIN_CODE__')
}
// remove app pin code
export function removeAppPinCode() {
  return secureStorage.delete('__APP_PIN_CODE__')
}
// verify app pin code
export async function verifyAppPinCode(pinCode: string) {
  const appPinHash = getAppPinCode()
  if (!appPinHash) {
    return false
  }
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pinCode
  )
  return appPinHash === hash
}

export default secureStorage;
