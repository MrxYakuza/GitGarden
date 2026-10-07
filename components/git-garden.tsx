"use client";

import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
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

const subscribeToOrigin = () => () => {};
const getBrowserOrigin = () => window.location.origin;
const getServerOrigin = () => "";

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
      <ellipse cx={x} cy={y + 1.5} rx={day.level === 4 ? 8 : 5} ry="2.2" fill={theme.background} opacity=".28" />
      {day.level === 1 && (
        <>
          <path d={`M${x} ${y}C${x - 1} ${y - 5} ${x + 1} ${y - 9} ${x} ${y - 12}`} stroke="url(#stemGradient)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <ellipse cx={x - 3.3} cy={y - 6.5} rx="4" ry="2.2" fill="url(#leafGradient)" transform={`rotate(28 ${x - 3.3} ${y - 6.5})`} />
          <ellipse cx={x + 3.2} cy={y - 9.5} rx="4" ry="2.2" fill="url(#leafGradient)" transform={`rotate(-32 ${x + 3.2} ${y - 9.5})`} />
        </>
      )}
      {day.level === 2 && (
        <>
          <path d={`M${x} ${y}C${x - 1} ${y - 7} ${x + 1} ${y - 12} ${x} ${y - 16}`} stroke="url(#stemGradient)" strokeWidth="2.1" strokeLinecap="round" fill="none" />
          <ellipse cx={x - 3.4} cy={y - 7.5} rx="4.2" ry="2.2" fill="url(#leafGradient)" transform={`rotate(30 ${x - 3.4} ${y - 7.5})`} />
          <ellipse cx={x + 3.3} cy={y - 11} rx="4" ry="2.1" fill="url(#leafGradient)" transform={`rotate(-31 ${x + 3.3} ${y - 11})`} />
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse key={angle} cx={x} cy={y - 20} rx="2.5" ry="4.5" fill={isGolden ? "url(#goldPetalGradient)" : "url(#petalGradient)"} transform={`rotate(${angle} ${x} ${y - 16})`} />
          ))}
          <circle cx={x} cy={y - 16} r="2.2" fill={theme.bloomAlt} />
          <circle cx={x - 0.7} cy={y - 16.8} r=".7" fill={theme.text} opacity=".65" />
        </>
      )}
      {day.level === 3 && (
        <>
          <path d={`M${x} ${y}C${x - 2} ${y - 8} ${x - 6} ${y - 11} ${x - 7} ${y - 15}M${x} ${y - 3}C${x + 3} ${y - 9} ${x + 7} ${y - 11} ${x + 7} ${y - 16}M${x} ${y}C${x} ${y - 8} ${x} ${y - 14} ${x} ${y - 19}`} stroke="url(#stemGradient)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx={x - 6} cy={y - 8} rx="5.3" ry="3.2" fill="url(#leafGradient)" transform={`rotate(22 ${x - 6} ${y - 8})`} />
          <ellipse cx={x + 6} cy={y - 9} rx="5.3" ry="3.2" fill="url(#leafGradient)" transform={`rotate(-22 ${x + 6} ${y - 9})`} />
          <ellipse cx={x - 2} cy={y - 13} rx="5" ry="3" fill="url(#leafGradient)" transform={`rotate(-18 ${x - 2} ${y - 13})`} />
          <ellipse cx={x + 2} cy={y - 16} rx="5" ry="3" fill="url(#leafGradient)" transform={`rotate(18 ${x + 2} ${y - 16})`} />
          {[-7, 0, 7].map((offset, index) => (
            <g key={offset}>
              <circle cx={x + offset} cy={y - 18 - (index % 2) * 3} r="3.6" fill={isGolden ? "url(#goldPetalGradient)" : "url(#petalGradient)"} />
              <circle cx={x + offset} cy={y - 18 - (index % 2) * 3} r="1.25" fill={theme.bloomAlt} />
            </g>
          ))}
        </>
      )}
      {day.level === 4 && (
        <>
          {isGolden && <circle cx={x} cy={y - 22} r="19" fill="url(#goldHalo)" />}
          <path d={`M${x - 3} ${y}C${x - 2} ${y - 10} ${x - 3} ${y - 17} ${x} ${y - 24}C${x + 3} ${y - 15} ${x + 2} ${y - 8} ${x + 3} ${y}Z`} fill="url(#trunkGradient)" />
          <path d={`M${x} ${y - 15}L${x - 8} ${y - 23}M${x + 1} ${y - 18}L${x + 9} ${y - 27}`} stroke={theme.soilTop} strokeWidth="2" strokeLinecap="round" />
          <circle cx={x - 8} cy={y - 25} r="8" fill="url(#canopyGradient)" />
          <circle cx={x + 8} cy={y - 27} r="9" fill="url(#canopyGradient)" />
          <circle cx={x} cy={y - 33} r="11" fill="url(#canopyGradient)" />
          <circle cx={x - 2} cy={y - 23} r="10" fill="url(#canopyGradient)" />
          <circle cx={x - 4} cy={y - 37} r="3.2" fill={bloom} opacity=".94" />
          <circle cx={x + 8} cy={y - 30} r="2.7" fill={bloom} opacity=".9" />
          <circle cx={x - 10} cy={y - 25} r="2.4" fill={theme.bloomAlt} opacity=".88" />
          <circle cx={x - 5} cy={y - 31} r="3.8" fill={theme.text} opacity=".12" />
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
  const bloom = theme.bloom;
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
        <linearGradient id="gardenSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={theme.background} />
          <stop offset="1" stopColor={theme.panel} />
        </linearGradient>
        <linearGradient id="soilTopGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.soilTop} />
          <stop offset="1" stopColor={theme.soil} />
        </linearGradient>
        <linearGradient id="soilSideGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={theme.soil} />
          <stop offset="1" stopColor={theme.background} />
        </linearGradient>
        <linearGradient id="leafGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.leaf} />
          <stop offset="1" stopColor={theme.stem} />
        </linearGradient>
        <linearGradient id="stemGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={theme.stem} />
          <stop offset="1" stopColor={theme.leaf} />
        </linearGradient>
        <linearGradient id="trunkGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={theme.soil} />
          <stop offset=".5" stopColor={theme.soilTop} />
          <stop offset="1" stopColor={theme.soil} />
        </linearGradient>
        <radialGradient id="canopyGradient" cx="35%" cy="28%" r="75%">
          <stop offset="0" stopColor={theme.leaf} />
          <stop offset="1" stopColor={theme.stem} />
        </radialGradient>
        <radialGradient id="petalGradient" cx="35%" cy="28%" r="75%">
          <stop offset="0" stopColor={theme.text} stopOpacity=".82" />
          <stop offset=".45" stopColor={bloom} />
          <stop offset="1" stopColor={theme.bloomAlt} />
        </radialGradient>
        <radialGradient id="goldPetalGradient" cx="35%" cy="28%" r="75%">
          <stop offset="0" stopColor="#f7dfa0" />
          <stop offset=".5" stopColor="#e8bd54" />
          <stop offset="1" stopColor="#b87921" />
        </radialGradient>
        <radialGradient id="goldHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#e8bd54" stopOpacity=".42" />
          <stop offset="1" stopColor="#e8bd54" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={theme.bloom} stopOpacity=".24" />
          <stop offset="1" stopColor={theme.bloom} stopOpacity="0" />
        </radialGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor={theme.background} floodOpacity=".35" />
        </filter>
      </defs>
      <rect width="980" height="470" rx="30" fill="url(#gardenSky)" />
      <circle cx="842" cy="82" r="138" fill="url(#sunGlow)" />
      <path d="M0 210C130 156 242 181 340 224C455 274 558 183 681 193C802 202 895 265 980 231V0H0Z" fill={theme.leaf} opacity=".09" />
      <path d="M0 269C127 224 229 250 332 279C453 313 565 245 700 254C815 262 905 313 980 287V470H0Z" fill={theme.soil} opacity=".1" />
      <ellipse cx="492" cy="284" rx="420" ry="151" fill={theme.background} opacity=".13" />
      <path d="M78 374C242 340 351 397 512 362s292-43 403-5" fill="none" stroke={theme.panel} strokeWidth="2" strokeDasharray="4 12" opacity=".55" />
      <g filter="url(#softShadow)">
        {garden.days.map((day) => {
          const x = 420 + (day.week - day.weekday) * 13;
          const y = 76 + (day.week + day.weekday) * 6.5;
          const active = selectedDay?.date === day.date;
          const soil = day.level === 0 ? theme.soil : "url(#soilTopGradient)";
          return (
            <g
              key={day.date}
              className="garden-tile cursor-pointer outline-none"
              onMouseEnter={() => onSelectDay(day)}
              onClick={() => onSelectDay(day)}
            >
              <title>{`${day.date}: ${day.count.toLocaleString("fa-IR")} مشارکت`}</title>
              <polygon points={`${x - 13},${y} ${x},${y + 6} ${x},${y + 10} ${x - 13},${y + 4}`} fill="url(#soilSideGradient)" opacity={day.level === 0 ? 0.48 : 0.86} />
              <polygon points={`${x + 13},${y} ${x},${y + 6} ${x},${y + 10} ${x + 13},${y + 4}`} fill={theme.soil} opacity={day.level === 0 ? 0.45 : 0.78} />
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
  const origin = useSyncExternalStore(subscribeToOrigin, getBrowserOrigin, getServerOrigin);
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
    return `${origin}/api/garden/${garden.username}?year=${garden.year}&theme=${themeName}`;
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
