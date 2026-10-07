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
  const shadow = `<ellipse cx="${x}" cy="${y + 1.5}" rx="${level === 4 ? 8 : 5}" ry="2.2" fill="${theme.background}" opacity=".28"/>`;
  if (level === 1) {
    return `${shadow}<path d="M${x} ${y}C${x - 1} ${y - 5} ${x + 1} ${y - 9} ${x} ${y - 12}" stroke="url(#stemGradient)" stroke-width="2.2" stroke-linecap="round" fill="none"/><ellipse cx="${x - 3.3}" cy="${y - 6.5}" rx="4" ry="2.2" fill="url(#leafGradient)" transform="rotate(28 ${x - 3.3} ${y - 6.5})"/><ellipse cx="${x + 3.2}" cy="${y - 9.5}" rx="4" ry="2.2" fill="url(#leafGradient)" transform="rotate(-32 ${x + 3.2} ${y - 9.5})"/>`;
  }
  if (level === 2) {
    const petals = [0, 72, 144, 216, 288].map((angle) => `<ellipse cx="${x}" cy="${y - 20}" rx="2.5" ry="4.5" fill="${golden ? "url(#goldPetalGradient)" : "url(#petalGradient)"}" transform="rotate(${angle} ${x} ${y - 16})"/>`).join("");
    return `${shadow}<path d="M${x} ${y}C${x - 1} ${y - 7} ${x + 1} ${y - 12} ${x} ${y - 16}" stroke="url(#stemGradient)" stroke-width="2.1" stroke-linecap="round" fill="none"/><ellipse cx="${x - 3.4}" cy="${y - 7.5}" rx="4.2" ry="2.2" fill="url(#leafGradient)" transform="rotate(30 ${x - 3.4} ${y - 7.5})"/><ellipse cx="${x + 3.3}" cy="${y - 11}" rx="4" ry="2.1" fill="url(#leafGradient)" transform="rotate(-31 ${x + 3.3} ${y - 11})"/>${petals}<circle cx="${x}" cy="${y - 16}" r="2.2" fill="${theme.bloomAlt}"/><circle cx="${x - 0.7}" cy="${y - 16.8}" r=".7" fill="${theme.text}" opacity=".65"/>`;
  }
  if (level === 3) {
    const flowers = [-7, 0, 7].map((offset, index) => `<circle cx="${x + offset}" cy="${y - 18 - (index % 2) * 3}" r="3.6" fill="${golden ? "url(#goldPetalGradient)" : "url(#petalGradient)"}"/><circle cx="${x + offset}" cy="${y - 18 - (index % 2) * 3}" r="1.25" fill="${theme.bloomAlt}"/>`).join("");
    return `${shadow}<path d="M${x} ${y}C${x - 2} ${y - 8} ${x - 6} ${y - 11} ${x - 7} ${y - 15}M${x} ${y - 3}C${x + 3} ${y - 9} ${x + 7} ${y - 11} ${x + 7} ${y - 16}M${x} ${y}C${x} ${y - 8} ${x} ${y - 14} ${x} ${y - 19}" stroke="url(#stemGradient)" stroke-width="2" stroke-linecap="round" fill="none"/><ellipse cx="${x - 6}" cy="${y - 8}" rx="5.3" ry="3.2" fill="url(#leafGradient)" transform="rotate(22 ${x - 6} ${y - 8})"/><ellipse cx="${x + 6}" cy="${y - 9}" rx="5.3" ry="3.2" fill="url(#leafGradient)" transform="rotate(-22 ${x + 6} ${y - 9})"/><ellipse cx="${x - 2}" cy="${y - 13}" rx="5" ry="3" fill="url(#leafGradient)" transform="rotate(-18 ${x - 2} ${y - 13})"/><ellipse cx="${x + 2}" cy="${y - 16}" rx="5" ry="3" fill="url(#leafGradient)" transform="rotate(18 ${x + 2} ${y - 16})"/>${flowers}`;
  }
  return `${shadow}${golden ? `<circle cx="${x}" cy="${y - 22}" r="19" fill="url(#goldHalo)"/>` : ""}<path d="M${x - 3} ${y}C${x - 2} ${y - 10} ${x - 3} ${y - 17} ${x} ${y - 24}C${x + 3} ${y - 15} ${x + 2} ${y - 8} ${x + 3} ${y}Z" fill="url(#trunkGradient)"/><path d="M${x} ${y - 15}L${x - 8} ${y - 23}M${x + 1} ${y - 18}L${x + 9} ${y - 27}" stroke="${theme.soilTop}" stroke-width="2" stroke-linecap="round"/><circle cx="${x - 8}" cy="${y - 25}" r="8" fill="url(#canopyGradient)"/><circle cx="${x + 8}" cy="${y - 27}" r="9" fill="url(#canopyGradient)"/><circle cx="${x}" cy="${y - 33}" r="11" fill="url(#canopyGradient)"/><circle cx="${x - 2}" cy="${y - 23}" r="10" fill="url(#canopyGradient)"/><circle cx="${x - 4}" cy="${y - 37}" r="3.2" fill="${bloom}"/><circle cx="${x + 8}" cy="${y - 30}" r="2.7" fill="${bloom}"/><circle cx="${x - 10}" cy="${y - 25}" r="2.4" fill="${theme.bloomAlt}"/>`;
}

export function generateGardenSvg(data: GardenData, themeName: ThemeName) {
  const theme = gardenThemes[themeName];
  const bestDate = data.stats.bestDay?.date;
  const tiles = data.days.map((day) => {
    const x = 420 + (day.week - day.weekday) * 13;
    const y = 82 + (day.week + day.weekday) * 6.5;
    const soil = day.level === 0 ? theme.soil : theme.soilTop;
    return `<g><polygon points="${x - 13},${y} ${x},${y + 6} ${x},${y + 10} ${x - 13},${y + 4}" fill="url(#soilSideGradient)" opacity="${day.level === 0 ? 0.48 : 0.86}"/><polygon points="${x + 13},${y} ${x},${y + 6} ${x},${y + 10} ${x + 13},${y + 4}" fill="${theme.soil}" opacity="${day.level === 0 ? 0.45 : 0.78}"/><polygon points="${x},${y - 6} ${x + 13},${y} ${x},${y + 6} ${x - 13},${y}" fill="${day.level === 0 ? soil : "url(#soilTopGradient)"}" opacity="${day.level === 0 ? 0.64 : 1}"/>${plantMarkup(day.level, x, y, theme, day.date === bestDate)}</g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 480" width="980" height="480" role="img" aria-label="باغ فعالیت‌های ${escapeXml(data.username)} در سال ${data.year}">
  <defs>
    <linearGradient id="gardenSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${theme.background}"/><stop offset="1" stop-color="${theme.panel}"/></linearGradient>
    <linearGradient id="soilTopGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${theme.soilTop}"/><stop offset="1" stop-color="${theme.soil}"/></linearGradient>
    <linearGradient id="soilSideGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${theme.soil}"/><stop offset="1" stop-color="${theme.background}"/></linearGradient>
    <linearGradient id="leafGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${theme.leaf}"/><stop offset="1" stop-color="${theme.stem}"/></linearGradient>
    <linearGradient id="stemGradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${theme.stem}"/><stop offset="1" stop-color="${theme.leaf}"/></linearGradient>
    <linearGradient id="trunkGradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${theme.soil}"/><stop offset=".5" stop-color="${theme.soilTop}"/><stop offset="1" stop-color="${theme.soil}"/></linearGradient>
    <radialGradient id="canopyGradient" cx="35%" cy="28%" r="75%"><stop offset="0" stop-color="${theme.leaf}"/><stop offset="1" stop-color="${theme.stem}"/></radialGradient>
    <radialGradient id="petalGradient" cx="35%" cy="28%" r="75%"><stop offset="0" stop-color="${theme.text}" stop-opacity=".82"/><stop offset=".45" stop-color="${theme.bloom}"/><stop offset="1" stop-color="${theme.bloomAlt}"/></radialGradient>
    <radialGradient id="goldPetalGradient" cx="35%" cy="28%" r="75%"><stop offset="0" stop-color="#f7dfa0"/><stop offset=".5" stop-color="#e8bd54"/><stop offset="1" stop-color="#b87921"/></radialGradient>
    <radialGradient id="goldHalo"><stop offset="0" stop-color="#e8bd54" stop-opacity=".42"/><stop offset="1" stop-color="#e8bd54" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="980" height="480" rx="32" fill="url(#gardenSky)"/>
  <circle cx="850" cy="70" r="120" fill="${theme.bloom}" opacity=".08"/>
  <path d="M0 210C130 156 242 181 340 224C455 274 558 183 681 193C802 202 895 265 980 231V0H0Z" fill="${theme.leaf}" opacity=".09"/>
  <path d="M0 269C127 224 229 250 332 279C453 313 565 245 700 254C815 262 905 313 980 287V480H0Z" fill="${theme.soil}" opacity=".1"/>
  <ellipse cx="492" cy="294" rx="420" ry="151" fill="${theme.background}" opacity=".13"/>
  <text x="932" y="64" text-anchor="end" direction="rtl" fill="${theme.text}" font-family="Tahoma, Arial, sans-serif" font-size="31" font-weight="700">باغِ ${escapeXml(data.displayName)}</text>
  <text x="931" y="91" text-anchor="end" direction="rtl" fill="${theme.text}" opacity=".72" font-family="Tahoma, Arial, sans-serif" font-size="15">سال ${data.year.toLocaleString("fa-IR", { useGrouping: false })} · ${data.stats.total.toLocaleString("fa-IR")} مشارکت · ${data.stats.longestStreak.toLocaleString("fa-IR")} روز فعالیت پیوسته</text>
  <g>${tiles}</g>
  <text x="932" y="444" text-anchor="end" direction="rtl" fill="${theme.text}" opacity=".66" font-family="Tahoma, Arial, sans-serif" font-size="14">ساخته‌شده با گیت‌گاردن</text>
</svg>`;
}
