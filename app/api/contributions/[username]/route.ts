import { NextRequest, NextResponse } from "next/server";
import { getGardenData } from "@/lib/github";

const usernamePattern = /^(?!-)(?!.*--)[A-Za-z0-9-]{1,39}(?<!-)$/;

export async function GET(request: NextRequest, context: { params: Promise<{ username: string }> }) {
  const { username } = await context.params;
  const year = Number(request.nextUrl.searchParams.get("year")) || new Date().getFullYear();
  if (!usernamePattern.test(username) || year < 2008 || year > new Date().getFullYear()) {
    return NextResponse.json({ error: "نام کاربری گیت‌هاب یا سال واردشده معتبر نیست." }, { status: 400 });
  }
  try {
    const garden = await getGardenData(username, year);
    return NextResponse.json(garden, {
      headers: { "Cache-Control": "public, max-age=900, stale-while-revalidate=21600" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "دریافت اطلاعات گیت‌هاب ممکن نشد.";
    return NextResponse.json({ error: message }, { status: message.includes("پیدا نشد") ? 404 : 502 });
  }
}
