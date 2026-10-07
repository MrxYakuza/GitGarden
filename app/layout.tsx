import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "گیت‌گاردن — باغ فعالیت‌های گیت‌هاب شما",
  description: "فعالیت‌های گیت‌هاب خود را به یک باغ زنده و قابل‌اشتراک تبدیل کنید.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
