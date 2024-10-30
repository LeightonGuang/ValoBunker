import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Valo Bunker",
  description: "Anything useful about Valorant is here for you!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
