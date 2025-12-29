import { accountStore } from "@/store/userStore";

export const useAccounts = () => ({
  accounts: accountStore.accounts,
  activeAccount: accountStore.activeAccount,
  addAccount: accountStore.addAccount,
  switchAccount: accountStore.switchAccount,
  removeAccount: accountStore.removeAccount,
});
