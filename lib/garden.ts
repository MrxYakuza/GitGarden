export type ThemeName = "forest" | "midnight" | "sakura";

export type GardenDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  week: number;
  weekday: number;
};

export type GardenStats = {
  total: number;
  activeDays: number;
  longestStreak: number;
  bestDay: GardenDay | null;
};

export type GardenData = {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  year: number;
  days: GardenDay[];
  stats: GardenStats;
  isDemo: boolean;
};

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededUnit(seed: string) {
  let value = hashString(seed) + 0x6d2b79f5;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
}

export function levelForCount(count: number): GardenDay["level"] {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

export function calculateStats(days: GardenDay[]): GardenStats {
  let longestStreak = 0;
  let currentStreak = 0;
  let bestDay: GardenDay | null = null;

  for (const day of days) {
    if (day.count > 0) {
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
    if (!bestDay || day.count > bestDay.count) bestDay = day;
  }

  return {
    total: days.reduce((sum, day) => sum + day.count, 0),
    activeDays: days.filter((day) => day.count > 0).length,
    longestStreak,
    bestDay: bestDay?.count ? bestDay : null,
  };
}

export function generateDemoGarden(username: string, year: number): GardenData {
  const start = new Date(Date.UTC(year, 0, 1));
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  let streakBoost = 0;

  const days = Array.from({ length: 53 * 7 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    const dateKey = date.toISOString().slice(0, 10);
    const chance = seededUnit(`${username}:${year}:${dateKey}:chance`);
    const intensity = seededUnit(`${username}:${year}:${dateKey}:intensity`);
    if (chance > 0.7) streakBoost = Math.min(0.24, streakBoost + 0.055);
    else streakBoost = Math.max(0, streakBoost - 0.035);
    const count = chance + streakBoost > 0.5
      ? Math.max(1, Math.round(Math.pow(intensity, 1.35) * 18))
      : 0;

    return {
      date: dateKey,
      count,
      level: levelForCount(count),
      week: Math.floor(index / 7),
      weekday: index % 7,
    } satisfies GardenDay;
  });

  return {
    username,
    displayName: username === "octocat" ? "The Octocat" : username,
    avatarUrl: `https://github.com/${encodeURIComponent(username)}.png?size=160`,
    year,
    days,
    stats: calculateStats(days),
    isDemo: true,
  };
}
