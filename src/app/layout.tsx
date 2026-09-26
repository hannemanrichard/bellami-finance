import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/shared/components/pwa/ServiceWorkerRegister";
import { ThemeProvider } from "@/shared/components/ThemeProvider";
import { ConditionalClerkProvider } from "@/shared/components/providers/ConditionalClerkProvider";
import { ReactQueryProvider } from "@/shared/lib/providers/react-query";
import { I18nProvider } from "@/shared/lib/providers/i18n-provider";
import { Toaster } from "@/shared/components/ui/toaster";
import localFont from "next/font/local";
import { Lato } from "next/font/google";

// Define Lato font (default) from Google Fonts
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

// Define Cairo font (for Arabic)
const cairo = localFont({
  src: [
    {
      path: "../../public/fonts/cairo/Cairo-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/cairo/Cairo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#E4EDF5",
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  applicationName: "bellami-finance",
  title: {
    template: "%s | bellami-finance",
    default: "bellami-finance",
  },
  description: "Record and manage expenses in bellami-finance",
  appleWebApp: {
    capable: true,
    title: "bellami-finance",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head />
      <body
        className={`${lato.variable} ${cairo.variable} min-h-dvh overflow-x-hidden font-sans antialiased`}
      >
        <ConditionalClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <I18nProvider>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </I18nProvider>
          </ThemeProvider>
        </ConditionalClerkProvider>
        <ServiceWorkerRegister />
        <Toaster />
      </body>
    </html>
  );
}
