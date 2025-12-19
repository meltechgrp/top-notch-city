// auth/secure.ts
import * as SecureStore from "expo-secure-store";

export async function setActiveUserId(id: string) {
  await SecureStore.setItemAsync("active_user_id", id);
}

export async function getActiveUserId() {
  return SecureStore.getItemAsync("active_user_id");
}

export async function setToken(userId: string, token: string) {
  await SecureStore.setItemAsync(`token_${userId}`, token);
}

export async function getToken(userId: string) {
  return SecureStore.getItemAsync(`token_${userId}`);
}
export async function getActiveAccount() {
  const userId = await SecureStore.getItemAsync("active_user_id");
  const token = await SecureStore.getItemAsync(`token_${userId}`);
  return { userId, token };
}
export async function getActiveToken() {
  const userId = await SecureStore.getItemAsync("active_user_id");
  if (!userId) return null;
  return SecureStore.getItemAsync(`token_${userId}`);
}

export async function removeToken(userId: string) {
  await SecureStore.deleteItemAsync(`token_${userId}`);
}
export async function removeActiveUser() {
  await SecureStore.deleteItemAsync(`active_user_id`);
}
