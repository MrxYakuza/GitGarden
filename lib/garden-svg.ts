import type { GardenData, ThemeName } from "@/lib/garden";

export const gardenThemes = {
  forest: {
    background: "#2f3b25", panel: "#48543a", soil: "#8b674d", soilTop: "#a87f59",
    stem: "#606c38", leaf: "#8b9d83", bloom: "#c08e3a", bloomAlt: "#c66b3d", text: "#e8dcc7",
  },
  midnight: {
    background: "#28342f", panel: "#3c4a42", soil: "#725d4c", soilTop: "#8b735d",
    stem: "#8b9d83", leaf: "#aab99f", bloom: "#c08e3a", bloomAlt: "#b08b6e", text: "#e8dcc7",
  },
  sakura: {
    background: "#596447", panel: "#6f795c", soil: "#9a745f", soilTop: "#b08b6e",
    stem: "#606c38", leaf: "#8b9d83", bloom: "#d8a6a0", bloomAlt: "#c66b3d", text: "#f0e3d2",
  },
} satisfies Record<ThemeName, Record<string, string>>;

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({
  "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
})[character] ?? character);

function plantMarkup(level: number, x: number, y: number, theme: (typeof gardenThemes)[ThemeName], golden: boolean) {
  if (level === 0) return "";
  const bloom = golden ? "#e8bd54" : theme.bloom;
  const stem = `<path d="M${x} ${y - 1}v-10" stroke="${theme.stem}" stroke-width="2" stroke-linecap="round"/>`;
  const leaves = `<ellipse cx="${x - 3}" cy="${y - 6}" rx="3.5" ry="2" fill="${theme.leaf}" transform="rotate(28 ${x - 3} ${y - 6})"/><ellipse cx="${x + 3}" cy="${y - 9}" rx="3.5" ry="2" fill="${theme.leaf}" transform="rotate(-28 ${x + 3} ${y - 9})"/>`;
  if (level === 1) return `${stem}${leaves}`;
  if (level === 2) return `${stem}${leaves}<circle cx="${x}" cy="${y - 13}" r="4" fill="${bloom}"/><circle cx="${x}" cy="${y - 13}" r="1.4" fill="${theme.bloomAlt}"/>`;
  if (level === 3) return `<circle cx="${x - 4}" cy="${y - 7}" r="5" fill="${theme.leaf}"/><circle cx="${x + 4}" cy="${y - 8}" r="5" fill="${theme.leaf}"/><circle cx="${x}" cy="${y - 12}" r="6" fill="${theme.stem}"/><circle cx="${x - 1}" cy="${y - 12}" r="2" fill="${bloom}"/>`;
  return `<path d="M${x - 2} ${y}l1-14h3l1 14z" fill="${theme.soil}"/><circle cx="${x}" cy="${y - 19}" r="9" fill="${theme.stem}"/><circle cx="${x - 7}" cy="${y - 15}" r="6" fill="${theme.leaf}"/><circle cx="${x + 7}" cy="${y - 15}" r="6" fill="${theme.leaf}"/><circle cx="${x}" cy="${y - 22}" r="5" fill="${bloom}"/>`;
}

export function generateGardenSvg(data: GardenData, themeName: ThemeName) {
  const theme = gardenThemes[themeName];
  const bestDate = data.stats.bestDay?.date;
  const tiles = data.days.map((day) => {
    const x = 420 + (day.week - day.weekday) * 13;
    const y = 82 + (day.week + day.weekday) * 6.5;
    const soil = day.level === 0 ? theme.soil : theme.soilTop;
    return `<g><polygon points="${x},${y - 6} ${x + 13},${y} ${x},${y + 6} ${x - 13},${y}" fill="${soil}" opacity="${day.level === 0 ? 0.64 : 1}"/>${plantMarkup(day.level, x, y, theme, day.date === bestDate)}</g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 480" width="980" height="480" role="img" aria-label="باغ فعالیت‌های ${escapeXml(data.username)} در سال ${data.year}">
  <rect width="980" height="480" rx="32" fill="${theme.background}"/>
  <circle cx="850" cy="70" r="120" fill="${theme.bloom}" opacity=".08"/>
  <text x="932" y="64" text-anchor="end" direction="rtl" fill="${theme.text}" font-family="Tahoma, Arial, sans-serif" font-size="31" font-weight="700">باغِ ${escapeXml(data.displayName)}</text>
  <text x="931" y="91" text-anchor="end" direction="rtl" fill="${theme.text}" opacity=".72" font-family="Tahoma, Arial, sans-serif" font-size="15">سال ${data.year.toLocaleString("fa-IR", { useGrouping: false })} · ${data.stats.total.toLocaleString("fa-IR")} مشارکت · ${data.stats.longestStreak.toLocaleString("fa-IR")} روز فعالیت پیوسته</text>
  <g>${tiles}</g>
  <text x="932" y="444" text-anchor="end" direction="rtl" fill="${theme.text}" opacity=".66" font-family="Tahoma, Arial, sans-serif" font-size="14">ساخته‌شده با گیت‌گاردن</text>
</svg>`;
}
