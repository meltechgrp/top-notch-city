import { format, isThisYear, isToday, subDays, subMonths } from "date-fns";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

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

export function formatMessageTime(
  time: Date,
  opt?: { hideTimeForFullDate?: boolean; onlyTime?: boolean }
) {
  const { hideTimeForFullDate } = opt || {
    hideTimeForFullDate: false,
  };
  const localDate = typeof time === "string" ? new Date(time) : time;

  if (opt?.onlyTime) {
    return format(localDate, "h:mm");
  }
  if (isToday(localDate)) {
    return format(localDate, "h:mm a");
  } else if (isThisYear(localDate)) {
    return format(localDate, `MMM d${hideTimeForFullDate ? "" : ", h:mm a"}`);
  }
  return format(
    localDate,
    `MM/dd/yyyy${hideTimeForFullDate ? "" : ", h:mm a"}`
  );
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

export function formatMoney(
  amount: number,
  currency: string,
  fractionDigits: number = 2
) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
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

export function fullName(user: any) {
  return !user?.first_name ? "" : `${user.first_name} ${user.last_name}`;
}
export const FindAmenity = (item: string, data?: Property["amenities"]) => {
  return Number(data?.find((a) => a.name == item)?.value || 0);
};

export function generateTitle({
  category,
  subcategory,
  amenities,
  purpose,
}: Property) {
  switch (category.name.trim()) {
    case "Residential":
      return `${FindAmenity("Bedroom", amenities) || ""} Bedroom ${subcategory?.name || ""}`.trim();

    case "Commercial":
      return `${subcategory?.name || "Commercial Space"} ${purpose ? `for ${purpose}` : ""}`.trim();

    case "Land":
      return `${FindAmenity("Total Plot", amenities) || 1} Plot${FindAmenity("Total Plot", amenities) > 1 ? "s" : ""} of Land`;

    case "hotel":
    case "Shortlet":
    case "Chalet":
      return `${subcategory || category}${FindAmenity("Pool", amenities) ? " with Pool" : ""}${
        FindAmenity("Rooms", amenities)
          ? `, ${FindAmenity("Rooms", amenities)} Rooms`
          : ""
      }`;

    default:
      return `${subcategory.name || category.name}`;
  }
}

export function composeFullAddress(address: ParsedAddress, cityOnly?: boolean) {
  if (cityOnly) {
    return joinWithComma(address?.street, address?.city, address?.lga);
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

export function formatDateDistance(date: string, full?: boolean) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return `${interval}${full ? " years" : "y"} ago`;
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval}${full ? " days" : "d"} ago`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval}${full ? " hours" : "h"} ago`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval}${full ? " minutes" : "m"} ago`;
  }
  return `${Math.floor(seconds)}s ago`;
}

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

  const latitudeDelta = (maxLat - minLat) * 1.5 || 0.05;
  const longitudeDelta = (maxLng - minLng) * 1.5 || 0.05;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
}

type EntryKeyMap = {
  dateKey: string;
  valueKey: string;
};

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
  month: string;
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

export function formatNumber(num?: string) {
  return num?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function unformatNumber(str: string) {
  return str.replace(/,/g, "");
}
export function calculateFeedDisplayDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  if (
    originalWidth <= 0 ||
    originalHeight <= 0 ||
    maxWidth <= 0 ||
    maxHeight <= 0
  ) {
    return { width: 0, height: 0 };
  }

  const aspectRatio = originalWidth / originalHeight;
  const minAspectRatioForNoCrop = 3 / 4; // 0.75

  let displayWidth: number;
  let displayHeight: number;

  if (originalWidth > maxWidth || originalHeight > maxHeight) {
    const widthScale = maxWidth / originalWidth;
    const heightScale = maxHeight / originalHeight;
    const scale = Math.min(widthScale, heightScale);

    displayWidth = Math.min(originalWidth * scale, maxWidth);
    displayHeight = Math.min(originalHeight * scale, maxHeight);
  } else {
    displayWidth = originalWidth;
    displayHeight = originalHeight;
  }

  if (
    aspectRatio < minAspectRatioForNoCrop &&
    displayHeight > (4 / 3) * displayWidth
  ) {
    displayHeight = (4 / 3) * displayWidth;
  }

  return { width: Math.floor(displayWidth), height: Math.floor(displayHeight) };
}
export function guidGenerator() {
  const S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

export async function uploadWithFakeProgress(
  uploadFn: () => Promise<Media[]>,
  onProgress: (val: number) => void,
  isVideo: boolean
) {
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * (isVideo ? 1 : 5);

    if (progress > 90) progress = 90;
    onProgress(Math.round(progress));
  }, 100);

  return uploadFn()
    .then((res) => {
      clearInterval(interval);
      onProgress(100);
      return res;
    })
    .catch((err) => {
      clearInterval(interval);
      onProgress(0);
      throw err;
    });
}
