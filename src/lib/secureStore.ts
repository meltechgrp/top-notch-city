import * as SecureStore from "expo-secure-store";

const ACCOUNTS_KEY = "tnc_accounts";
const ACTIVE_KEY = "tnc_active";

export async function getAccounts(): Promise<StoredAccount[]> {
  const raw = await SecureStore.getItemAsync(ACCOUNTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveAccounts(list: StoredAccount[]) {
  await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(list));
}

export async function addAccountToStorage(acc: StoredAccount) {
  const accounts = await getAccounts();

  const exists = accounts.find((a) => a.id === acc.id);

  let updated = exists
    ? accounts.map((a) => (a.id === acc.id ? acc : a))
    : [...accounts, acc];

  await saveAccounts(updated);

  await setActiveUserId(acc.id);
}

export async function setActiveUserId(id: string) {
  await SecureStore.setItemAsync(ACTIVE_KEY, id);
}

export async function getActiveUserId(): Promise<string | null> {
  return await SecureStore.getItemAsync(ACTIVE_KEY);
}

export async function getActiveAccount(): Promise<StoredAccount | null> {
  const id = await getActiveUserId();
  if (!id) return null;

  const accounts = await getAccounts();
  return accounts.find((a) => a.id === id) ?? null;
}

export async function getActiveToken(): Promise<string | null> {
  const acc = await getActiveAccount();
  return acc?.token ?? null;
}

export async function removeAccount(id: string) {
  const accounts = await getAccounts();
  const updated = accounts.filter((a) => a.id !== id);

  await saveAccounts(updated);

  const activeId = await getActiveUserId();
  if (activeId === id) {
    await SecureStore.deleteItemAsync(ACTIVE_KEY);

    if (updated.length > 0) {
      await setActiveUserId(updated[0].id);
    }
  }
}

export async function clearAllAccounts() {
  await SecureStore.deleteItemAsync(ACCOUNTS_KEY);
  await SecureStore.deleteItemAsync(ACTIVE_KEY);
}
