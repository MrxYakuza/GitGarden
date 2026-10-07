"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clipboard,
  Download,
  Code2,
  Leaf,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GardenData, GardenDay, ThemeName } from "@/lib/garden";
import { gardenThemes } from "@/lib/garden-svg";

const themeLabels: Record<ThemeName, string> = {
  forest: "جنگل",
  midnight: "نیمه‌شب",
  sakura: "شکوفه",
};

const sourceUrl = process.env.NEXT_PUBLIC_GITHUB_REPO_URL ?? "https://github.com";

function Plant({
  day,
  x,
  y,
  themeName,
  isGolden,
}: {
  day: GardenDay;
  x: number;
  y: number;
  themeName: ThemeName;
  isGolden: boolean;
}) {
  const theme = gardenThemes[themeName];
  const bloom = isGolden ? "#e8bd54" : theme.bloom;
  const delay = `${(day.week * 7 + day.weekday) * 2.1}ms`;
  if (day.level === 0) return null;

  return (
    <g className="plant-growth" style={{ animationDelay: delay, transformOrigin: `${x}px ${y}px` }}>
      {day.level <= 2 && (
        <>
          <path d={`M${x} ${y - 1}v-10`} stroke={theme.stem} strokeWidth="2" strokeLinecap="round" />
          <ellipse cx={x - 3} cy={y - 6} rx="3.5" ry="2" fill={theme.leaf} transform={`rotate(28 ${x - 3} ${y - 6})`} />
          <ellipse cx={x + 3} cy={y - 9} rx="3.5" ry="2" fill={theme.leaf} transform={`rotate(-28 ${x + 3} ${y - 9})`} />
        </>
      )}
      {day.level === 2 && (
        <>
          <circle cx={x} cy={y - 13} r="4" fill={bloom} />
          <circle cx={x} cy={y - 13} r="1.4" fill={theme.bloomAlt} />
        </>
      )}
      {day.level === 3 && (
        <>
          <circle cx={x - 4} cy={y - 7} r="5" fill={theme.leaf} />
          <circle cx={x + 4} cy={y - 8} r="5" fill={theme.leaf} />
          <circle cx={x} cy={y - 12} r="6" fill={theme.stem} />
          <circle cx={x - 1} cy={y - 12} r="2" fill={bloom} />
        </>
      )}
      {day.level === 4 && (
        <>
          <path d={`M${x - 2} ${y}l1-14h3l1 14z`} fill={theme.soil} />
          <circle cx={x} cy={y - 19} r="9" fill={theme.stem} />
          <circle cx={x - 7} cy={y - 15} r="6" fill={theme.leaf} />
          <circle cx={x + 7} cy={y - 15} r="6" fill={theme.leaf} />
          <circle cx={x} cy={y - 22} r="5" fill={bloom} />
        </>
      )}
    </g>
  );
}

function GardenMap({
  garden,
  themeName,
  selectedDay,
  onSelectDay,
}: {
  garden: GardenData;
  themeName: ThemeName;
  selectedDay: GardenDay | null;
  onSelectDay: (day: GardenDay) => void;
}) {
  const theme = gardenThemes[themeName];
  const bestDate = garden.stats.bestDay?.date;

  return (
    <svg
      id="garden-map"
      viewBox="0 0 980 470"
      role="img"
      aria-label={`باغ فعالیت‌های ${garden.username} در سال ${garden.year}`}
      className="garden-map min-w-[760px]"
    >
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={theme.bloom} stopOpacity=".24" />
          <stop offset="1" stopColor={theme.bloom} stopOpacity="0" />
        </radialGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor={theme.background} floodOpacity=".35" />
        </filter>
      </defs>
      <rect width="980" height="470" rx="30" fill={theme.background} />
      <circle cx="842" cy="82" r="138" fill="url(#sunGlow)" />
      <path d="M78 374C242 340 351 397 512 362s292-43 403-5" fill="none" stroke={theme.panel} strokeWidth="2" strokeDasharray="4 12" opacity=".55" />
      <g filter="url(#softShadow)">
        {garden.days.map((day) => {
          const x = 420 + (day.week - day.weekday) * 13;
          const y = 76 + (day.week + day.weekday) * 6.5;
          const active = selectedDay?.date === day.date;
          const soil = day.level === 0 ? theme.soil : theme.soilTop;
          return (
            <g
              key={day.date}
              className="garden-tile cursor-pointer outline-none"
              onMouseEnter={() => onSelectDay(day)}
              onClick={() => onSelectDay(day)}
            >
              <title>{`${day.date}: ${day.count.toLocaleString("fa-IR")} مشارکت`}</title>
              <polygon
                points={`${x},${y - 6} ${x + 13},${y} ${x},${y + 6} ${x - 13},${y}`}
                fill={soil}
                opacity={day.level === 0 ? 0.68 : 1}
                stroke={active ? theme.text : "transparent"}
                strokeWidth={active ? 1.8 : 0}
              />
              <Plant day={day} x={x} y={y} themeName={themeName} isGolden={day.date === bestDate} />
            </g>
          );
        })}
      </g>
      <g fill={theme.text} opacity=".64" fontFamily="Epilogue, Arial, sans-serif" fontSize="12">
        <text x="68" y="418">فعالیت کمتر</text>
        <text x="842" y="418">فعالیت بیشتر</text>
      </g>
      {[0, 1, 2, 3, 4].map((level) => (
        <rect
          key={level}
          x={143 + level * 20}
          y="407"
          width="14"
          height="14"
          rx="4"
          fill={level === 0 ? theme.soil : level < 3 ? theme.leaf : level === 3 ? theme.stem : theme.bloom}
          opacity={level === 0 ? 0.62 : 1}
        />
      ))}
    </svg>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

export function GitGarden({ initialGarden }: { initialGarden: GardenData }) {
  const [garden, setGarden] = useState(initialGarden);
  const [username, setUsername] = useState(initialGarden.username);
  const [year, setYear] = useState(String(initialGarden.year));
  const [themeName, setThemeName] = useState<ThemeName>("forest");
  const [selectedDay, setSelectedDay] = useState<GardenDay | null>(initialGarden.stats.bestDay);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => Array.from({ length: 6 }, (_, index) => currentYear - index), [currentYear]);

  async function growGarden(event: FormEvent) {
    event.preventDefault();
    const cleanUsername = username.trim().replace(/^@/, "");
    if (!cleanUsername) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/contributions/${encodeURIComponent(cleanUsername)}?year=${year}`);
      const payload = (await response.json()) as GardenData | { error?: string };
      if (!response.ok) {
        throw new Error("error" in payload && payload.error ? payload.error : "ساخت این باغ ممکن نشد.");
      }
      const nextGarden = payload as GardenData;
      setGarden(nextGarden);
      setSelectedDay(nextGarden.stats.bestDay);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "ساخت این باغ ممکن نشد.");
    } finally {
      setLoading(false);
    }
  }

  function embedUrl() {
    return `${window.location.origin}/api/garden/${garden.username}?year=${garden.year}&theme=${themeName}`;
  }

  async function copyEmbed() {
    await navigator.clipboard.writeText(`![باغ گیت‌هاب ${garden.username}](${embedUrl()})`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadSvg() {
    const anchor = document.createElement("a");
    anchor.href = embedUrl();
    anchor.download = `${garden.username}-gitgarden-${garden.year}.svg`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a href="#garden" className="brand" aria-label="صفحه اصلی گیت‌گاردن">
          <span className="brand-mark"><Leaf aria-hidden="true" /></span>
          <span>گیت‌گاردن</span>
        </a>
        <a className="github-link" href={sourceUrl} target="_blank" rel="noreferrer">
          <Code2 aria-hidden="true" />
          <span>متن‌باز</span>
        </a>
      </header>

      <section className="intro-grid">
        <div className="intro-copy">
          <span className="eyebrow"><Sparkles aria-hidden="true" /> فعالیت‌های یک سال شما، زنده و دیدنی</span>
          <h1>از فعالیت‌های گیت‌هاب خودت یک باغ بساز.</h1>
          <p>هر روز یک قطعه زمین است. هرچه مشارکت بیشتری داشته باشی، گیاهان بلندتری رشد می‌کنند و فعال‌ترین روزت به یک درخت طلایی تبدیل می‌شود.</p>
        </div>

        <form className="grow-form" onSubmit={growGarden}>
          <label htmlFor="username">نام کاربری گیت‌هاب</label>
          <div className="username-field">
            <span aria-hidden="true">github.com/</span>
            <Input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="octocat"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className="form-row">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger aria-label="سال فعالیت" className="garden-select">
                <CalendarDays aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((item) => <SelectItem key={item} value={String(item)}>{item.toLocaleString("fa-IR", { useGrouping: false })}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={loading} className="grow-button">
              {loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Leaf aria-hidden="true" />}
              {loading ? "در حال رشد…" : "باغم را بساز"}
            </Button>
          </div>
          <p aria-live="polite" className={error ? "form-note form-error" : "form-note"}>
            {error || (garden.isDemo ? "تا زمان افزودن توکن گیت‌هاب، داده‌های نمونه نمایش داده می‌شوند." : "مشارکت‌های عمومی گیت‌هاب نمایش داده می‌شوند.")}
          </p>
        </form>
      </section>

      <section id="garden" className="garden-section" style={{ "--garden-accent": gardenThemes[themeName].bloom } as React.CSSProperties}>
        <div className="garden-heading">
          <div className="profile-block">
            {garden.avatarUrl && <img src={garden.avatarUrl} alt="" className="avatar" />}
            <div>
              <div className="garden-title-row">
                <h2>باغِ {garden.displayName}</h2>
                {garden.isDemo && <span className="demo-badge">نمونه</span>}
              </div>
              <a href={`https://github.com/${garden.username}`} target="_blank" rel="noreferrer">@{garden.username} · {garden.year.toLocaleString("fa-IR", { useGrouping: false })}</a>
            </div>
          </div>
          <div className="garden-actions">
            <Select value={themeName} onValueChange={(value) => setThemeName(value as ThemeName)}>
              <SelectTrigger aria-label="پوسته باغ" className="garden-select theme-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(themeLabels) as ThemeName[]).map((item) => (
                  <SelectItem key={item} value={item}>{themeLabels[item]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" onClick={downloadSvg} className="secondary-button">
              <Download aria-hidden="true" /> دانلود SVG
            </Button>
          </div>
        </div>

        <div className="garden-stage">
          <div className="garden-scroll">
            <GardenMap garden={garden} themeName={themeName} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
          </div>
          <div className="day-inspector" aria-live="polite">
            <span>روز انتخاب‌شده</span>
            <strong>{selectedDay ? new Intl.DateTimeFormat("fa-IR-u-ca-gregory", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${selectedDay.date}T00:00:00Z`)) : "نشانگر را روی باغ ببر"}</strong>
            <p>{selectedDay ? `${selectedDay.count.toLocaleString("fa-IR")} مشارکت` : "هر قطعه نماینده‌ی یک روز است."}</p>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard label="مشارکت‌ها" value={garden.stats.total.toLocaleString("fa-IR")} detail={`در سال ${garden.year.toLocaleString("fa-IR", { useGrouping: false })}`} />
          <StatCard label="روزهای فعال" value={garden.stats.activeDays.toLocaleString("fa-IR")} detail="روزهایی که گیاه رشد کرده" />
          <StatCard label="طولانی‌ترین روند" value={`${garden.stats.longestStreak.toLocaleString("fa-IR")} روز`} detail="فعالیت پیوسته" />
          <StatCard label="بهترین روز" value={garden.stats.bestDay ? garden.stats.bestDay.count.toLocaleString("fa-IR") : "۰"} detail={garden.stats.bestDay ? new Intl.DateTimeFormat("fa-IR-u-ca-gregory", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${garden.stats.bestDay.date}T00:00:00Z`)) : "هنوز فعالیتی نیست"} />
        </div>

        <div className="embed-panel">
          <div>
            <h3>این باغ را در پروفایلت نمایش بده</h3>
            <p>کد مارک‌داون را کپی کن و داخل فایل README پروفایل گیت‌هابت قرار بده.</p>
          </div>
          <code>{`![باغ گیت‌هاب ${garden.username}](${embedUrl()})`}</code>
          <Button type="button" onClick={copyEmbed} className="copy-button">
            {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
            {copied ? "کپی شد" : "کپی کد"}
          </Button>
        </div>
      </section>

      <footer>
        <span>گیت‌گاردن · نتیجه‌ی استمرار خودت را ببین.</span>
        <a href={sourceUrl} target="_blank" rel="noreferrer">مشاهده کد پروژه</a>
      </footer>
    </main>
  );
}
