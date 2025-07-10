import { format, subDays, subMonths } from "date-fns";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import eventBus from "./eventBus";
import { useEffect, useState } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseFormat(value: string): string {
  if (!isNaN(Number(value)) && value.trim() !== "") {
    return formatMoney(Number(value), "NGN", 0);
  }
  return value;
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
  return formatMoney(toNaira(amountInKobo), "NGN", fractionDigits);
}

// show snackbar message
export function showSnackbar(option: SnackBarOption) {
  eventBus.dispatchEvent("addSnackBar", option);
}

export function formatMoney(
  amount: number,
  currency: string,
  fractionDigits: number = 2
) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    currencyDisplay: "symbol",
  }).format(amount);
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

// fullName of a user
export function fullName(user: any) {
  return !user?.first_name ? "" : `${user.first_name} ${user.last_name}`;
}
export const FindAmenity = (item: string, data?: Property["amenities"]) => {
  return data?.find((a) => a.name == item)?.value || 0;
};

export function composeFullAddress(
  address: ParsedAddress,
  cityOnly?: boolean,
  type: "long" | "short" = "short"
) {
  if (cityOnly && type === "short") {
    return joinWithComma(address?.state, address?.country);
  } else if (cityOnly && type === "long") {
    return joinWithComma(address?.city, address?.state, address?.country);
  }
  if (!address?.street) {
    return joinWithComma(
      address?.city,
      address?.lga,
      address?.state,
      address?.country
    );
  }
  return joinWithComma(
    address?.street,
    address?.city,
    address?.lga,
    address?.state,
    address?.country
  );
}
export function joinWithComma(...arr: Array<string | undefined | null>) {
  return arr.filter(Boolean).join(", ").trim();
}

export function formatDateDistance(date: string) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return `${interval}y ago`;
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval}d ago`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval}h ago`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval}m ago`;
  }
  return `${Math.floor(seconds)}s ago`;
}

export function useTimeAgo(date: string) {
  const [timeAgo, setTimeAgo] = useState(() => formatDateDistance(date));

  useEffect(() => {
    function getIntervalMs(label: string) {
      if (label.includes("s")) return 1000; // update every second
      if (label.includes("m")) return 60 * 1000; // update every minute
      if (label.includes("h")) return 60 * 60 * 1000; // update every hour
      return 60 * 60 * 1000; // default: hourly
    }

    const update = () => {
      const newTimeAgo = formatDateDistance(date);
      setTimeAgo(newTimeAgo);
      return getIntervalMs(newTimeAgo);
    };

    let intervalMs = update();

    const intervalId = setInterval(() => {
      intervalMs = update();
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [date]);

  return timeAgo;
}

// Calculate the bounding region for all markers
export function getRegionForMarkers(
  markers: { latitude: number; longitude: number }[]
) {
  if (markers.length === 0) {
    return {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 1,
      longitudeDelta: 1,
    };
  }

  let minLat = markers[0].latitude;
  let maxLat = markers[0].latitude;
  let minLng = markers[0].longitude;
  let maxLng = markers[0].longitude;

  markers.forEach((marker) => {
    minLat = Math.min(minLat, marker.latitude);
    maxLat = Math.max(maxLat, marker.latitude);
    minLng = Math.min(minLng, marker.longitude);
    maxLng = Math.max(maxLng, marker.longitude);
  });

  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;

  // Add padding to the deltas
  const latitudeDelta = (maxLat - minLat) * 1.5 || 0.05; // fallback if markers are close together
  const longitudeDelta = (maxLng - minLng) * 1.5 || 0.05;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
}

type EntryKeyMap = {
  dateKey: string; // e.g. "date" or "day"
  valueKey: string; // e.g. "views" or "count"
};

/**
 * Fill missing dates for the last 30 days dynamically
 */
export function fillMissingTimeSeries<T extends Record<string, any>>(
  data: T[],
  { dateKey, valueKey }: EntryKeyMap
): T[] {
  if (data.length === 0) return [];

  // Find the latest date
  const latestDate = data.reduce((latest, entry) => {
    const entryDate = new Date(entry[dateKey]);
    return entryDate > new Date(latest) ? entry[dateKey] : latest;
  }, data[0][dateKey]);

  // Build existing map
  const existingMap = new Map<string, number>();
  data.forEach((entry) => {
    existingMap.set(entry[dateKey], entry[valueKey]);
  });

  const result: T[] = [];

  // Count back 29 days from latest
  for (let i = 29; i >= 0; i--) {
    const d = subDays(new Date(latestDate), i);
    const formatted = format(d, "yyyy-MM-dd");

    result.push({
      [dateKey]: formatted,
      [valueKey]: existingMap.get(formatted) ?? 0,
    } as T);
  }

  return result;
}

type MonthlyData = {
  month: string; // ISO date string like "2025-06-01"
  count: number;
};

type ComparisonResult = {
  rate: number;
  direction: boolean;
};

export function compareRealCurrentMonth(
  data?: MonthlyData[]
): ComparisonResult {
  if (!data || data.length < 2) {
    return { rate: 0, direction: false };
  }

  // Sort ascending by date
  const sorted = [...data].sort(
    (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
  );

  // Format real system current month "YYYY-MM"
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = String(now.getUTCMonth() + 1).padStart(2, "0");
  const systemCurrent = `${currentYear}-${currentMonth}`;

  // Find current month entry
  const currentEntry = sorted.find((d) => d.month.startsWith(systemCurrent));

  if (!currentEntry) {
    // No record for real current month
    return { rate: 0, direction: false };
  }

  // Find previous entry before current month
  const currentIndex = sorted.indexOf(currentEntry);
  if (currentIndex < 1) {
    return { rate: 0, direction: false };
  }

  const previousEntry = sorted[currentIndex - 1];

  if (!previousEntry || previousEntry.count === undefined) {
    return { rate: 0, direction: false };
  }

  const previousCount = previousEntry.count;
  const currentCount = currentEntry.count;

  if (previousCount === 0) {
    return { rate: 100, direction: true };
  }

  const change = currentCount - previousCount;
  const rate = Math.round(Math.abs((change / previousCount) * 100));
  const direction = change >= 0;

  return { rate, direction };
}

export function fillLast6Months(data?: MonthlyData[]) {
  const today = new Date();
  const months: string[] = [];
  if (!data || data?.length < 1) {
    return [];
  }
  for (let i = 5; i >= 0; i--) {
    const month = subMonths(today, i);
    months.push(format(month, "yyyy-MM-01"));
  }

  const dataMap = new Map(data.map((item) => [item.month, item.count]));

  const filled = months.map((month) => ({
    label: month,
    value: dataMap.get(month) ?? 0,
  }));

  return filled;
}

export function deduplicate<T>(arr: T[], key: keyof T) {
  const map = new Map();
  arr.forEach((v) => {
    map.set(v[key], v);
  });
  return Array.from(map.values());
}

// Format number with commas
export function formatNumber(num?: string) {
  return num?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Remove commas from formatted number
export function unformatNumber(str: string) {
  return str.replace(/,/g, "");
}
