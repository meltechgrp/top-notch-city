import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_PREFIX = "RATE_LIMIT__";

type RateLimitRecord = {
  date: string;
  count: number;
};

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

async function readRecord(bucket: string): Promise<RateLimitRecord> {
  const raw = await AsyncStorage.getItem(`${KEY_PREFIX}${bucket}`);
  if (!raw) return { date: todayKey(), count: 0 };
  try {
    const parsed = JSON.parse(raw) as RateLimitRecord;
    if (parsed.date !== todayKey()) return { date: todayKey(), count: 0 };
    return parsed;
  } catch {
    return { date: todayKey(), count: 0 };
  }
}

async function writeRecord(bucket: string, record: RateLimitRecord) {
  await AsyncStorage.setItem(`${KEY_PREFIX}${bucket}`, JSON.stringify(record));
}

export async function checkDailyRateLimit(bucket: string, max: number) {
  const record = await readRecord(bucket);
  return {
    allowed: record.count < max,
    remaining: Math.max(0, max - record.count),
    used: record.count,
    max,
  };
}

export async function consumeDailyRateLimit(bucket: string, max: number) {
  const record = await readRecord(bucket);
  if (record.count >= max) {
    return { allowed: false, remaining: 0, used: record.count, max };
  }
  const next: RateLimitRecord = { date: record.date, count: record.count + 1 };
  await writeRecord(bucket, next);
  return {
    allowed: true,
    remaining: max - next.count,
    used: next.count,
    max,
  };
}
