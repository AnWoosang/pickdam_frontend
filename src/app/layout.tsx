import type { Metadata } from "next";
import localFont from 'next/font/local';
import { ClientLayout } from "@/shared/layout/ClientLayout";
import "./globals.css";

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '400 700',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: "Pickdam - 전자담배 가격 비교",
  description: "다양한 전자담배 제품의 가격을 비교하고 최저가를 찾아보세요"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${pretendard.variable} font-pretendard antialiased`}
        suppressHydrationWarning
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
