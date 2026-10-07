import {
  calculateStats,
  levelForCount,
  type GardenData,
  type GardenDay,
} from "@/lib/garden";

type GithubDay = { date: string; contributionCount: number };
type GithubResponse = {
  data?: {
    user: null | {
      login: string;
      name: string | null;
      avatarUrl: string;
      contributionsCollection: {
        contributionCalendar: {
          weeks: Array<{ contributionDays: GithubDay[] }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
};

const query = `
  query UserGarden($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      login
      name
      avatarUrl
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }
`;

export async function getGardenData(username: string, year: number): Promise<GardenData> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("توکن گیت‌هاب روی سرور تنظیم نشده است؛ عدد ساختگی نمایش داده نمی‌شود.");
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "GitGarden",
    },
    body: JSON.stringify({
      query,
      variables: {
        username,
        from: `${year}-01-01T00:00:00Z`,
        to: `${year}-12-31T23:59:59Z`,
      },
    }),
    next: { revalidate: 21600 },
  });

  if (!response.ok) throw new Error(`گیت‌هاب با خطای ${response.status} پاسخ داد.`);
  const payload = (await response.json()) as GithubResponse;
  if (payload.errors?.length) throw new Error("دریافت اطلاعات از گیت‌هاب ممکن نشد.");
  if (!payload.data?.user) throw new Error("کاربر گیت‌هاب پیدا نشد.");

  const days: GardenDay[] = payload.data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
    (week, weekIndex) =>
      week.contributionDays.map((day, weekday) => ({
        date: day.date,
        count: day.contributionCount,
        level: levelForCount(day.contributionCount),
        week: weekIndex,
        weekday,
      })),
  );

  return {
    username: payload.data.user.login,
    displayName: payload.data.user.name ?? payload.data.user.login,
    avatarUrl: payload.data.user.avatarUrl,
    year,
    days,
    stats: calculateStats(days),
    isDemo: false,
  };
}
