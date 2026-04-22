import NibrasAIChat from "@/components/NibrasAIChat";
import Pulse from "@/components/Pulse";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import { AppProvider } from "@/lib/AppContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ToastProvider } from "@/components/ui/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#D4AF37",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Al Nibras Finance - Kids Banking",
  description: "Financial literacy for Muslim families",
  icons: {
    icon: "/favicon.svg",
  },
  other: {
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.openai.com;",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shouldLoadVercelTelemetry = process.env.NODE_ENV === "production" && Boolean(process.env.VERCEL);
  let SpeedInsightsComponent: React.ComponentType | null = null;
  let AnalyticsComponent: React.ComponentType | null = null;

  if (shouldLoadVercelTelemetry) {
    const [{ SpeedInsights }, { Analytics }] = await Promise.all([
      import("@vercel/speed-insights/next"),
      import("@vercel/analytics/react"),
    ]);
    SpeedInsightsComponent = SpeedInsights;
    AnalyticsComponent = Analytics;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <AppProvider>
                {children}
                <NibrasAIChat mode="mentor" userName="Friend" />
                <Pulse />
              </AppProvider>
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
        {SpeedInsightsComponent ? <SpeedInsightsComponent /> : null}
        {AnalyticsComponent ? <AnalyticsComponent /> : null}
      </body>
    </html>
  );
}
