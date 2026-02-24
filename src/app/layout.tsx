import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sark Pharma Tech Services | Total Pharmaceutical Solution",
  description: "Sark Pharma Tech Services — pharmaceutical SOP database, regulatory insights, and compliance resources.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex w-full flex-col min-w-0">
              <Topbar />
              <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/20 p-4 md:p-6 w-full max-w-full">
                {children}
              </main>
              <Footer />
            </SidebarInset>
          </SidebarProvider>
          <CookieBanner />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
