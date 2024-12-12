import clsx from "clsx";
import "@/styles/globals.css";
import { Link } from "@nextui-org/link";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import AdSense from "@/components/AdSense";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import AdBlockDetector from "@/components/AdBlockDetector";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <AdSense publisherId={`${process.env.NextUI_ADSENSE_PUBLISHER_ID}`} />
      </head>
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <AdBlockDetector>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex h-screen flex-col">
              <Navbar />
              <main className="container mx-auto max-w-7xl flex-grow px-6 pt-6">
                {children}
              </main>
              <footer className="flex w-full items-center justify-center py-3">
                {/* <Link
                isExternal
                className="text-current flex items-center gap-1"
                href="https://nextui-docs-v2.vercel.app?utm_source=valobunker"
                title="nextui.org homepage"
              >
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">NextUI</p>
              </Link> */}
              </footer>
            </div>
          </Providers>
        </AdBlockDetector>
      </body>
    </html>
  );
}
