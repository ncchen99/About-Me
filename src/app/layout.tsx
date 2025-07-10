import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import StyledComponentsRegistry from "@/lib/styled-components";
import { StyledComponentsProvider } from "@/components/StyledComponentsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "個人介紹網頁",
  description: "使用 Next.js、React、Styled-components、GSAP 建立的個人介紹網頁",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
        <link rel="preload" href="/font/ChenYuluoyan-2.0-Thin.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <StyledComponentsRegistry>
          <StyledComponentsProvider>
            <Providers>
              {children}
            </Providers>
          </StyledComponentsProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
