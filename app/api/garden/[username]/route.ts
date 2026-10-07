import { NextRequest } from "next/server";
import { getGardenData } from "@/lib/github";
import { generateGardenSvg } from "@/lib/garden-svg";
import type { ThemeName } from "@/lib/garden";

const usernamePattern = /^(?!-)(?!.*--)[A-Za-z0-9-]{1,39}(?<!-)$/;
const themes = new Set<ThemeName>(["forest", "midnight", "sakura"]);

export async function GET(request: NextRequest, context: { params: Promise<{ username: string }> }) {
  const { username } = await context.params;
  const year = Number(request.nextUrl.searchParams.get("year")) || new Date().getFullYear();
  const requestedTheme = request.nextUrl.searchParams.get("theme") as ThemeName | null;
  const theme = requestedTheme && themes.has(requestedTheme) ? requestedTheme : "forest";
  if (!usernamePattern.test(username) || year < 2008 || year > new Date().getFullYear()) {
    return new Response("نام کاربری یا سال معتبر نیست.", { status: 400 });
  }
  try {
    const garden = await getGardenData(username, year);
    return new Response(generateGardenSvg(garden, theme), {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=900, stale-while-revalidate=21600",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
      },
    });
  } catch {
    return new Response("ساخت باغ ممکن نشد.", { status: 502 });
  }
}
