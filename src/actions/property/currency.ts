import { Fetch } from "../utills";

export const fetchAllCurrencies = async (): Promise<Currency[]> => {
  try {
    const res = await Fetch(`/currencies/`, {});
    return res as Currency[];
  } catch (error) {
    throw new Error("Failed to fetch currencies");
  }
};

export const addCurrency = async ({
  code,
  name,
  symbol,
}: {
  code: string;
  name: string;
  symbol: string;
}) => {
  try {
    const res = await Fetch(`/currencies/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { code, name, symbol },
    });

    if (res?.detail) throw new Error("Failed to add currency");
    return true;
  } catch (error) {
    throw error;
  }
};

export const editCurrency = async ({
  id,
  data,
}: {
  id: string;
  data: {
    code: string;
    name: string;
    symbol: string;
  };
}) => {
  try {
    const res = await Fetch(`/currencies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });

    if (res?.detail) throw new Error("Failed to edit currency");
    return true;
  } catch (error) {
    throw error;
  }
};

export const deleteCurrency = async ({ id }: { id: string }) => {
  try {
    const res = await Fetch(`/currencies/${id}`, {
      method: "DELETE",
    });

    if (res?.detail) throw new Error("Failed to delete currency");
    return true;
  } catch (error) {
    throw error;
  }
};
