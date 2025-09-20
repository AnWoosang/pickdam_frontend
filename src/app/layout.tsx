import type { Metadata } from "next";
import { ClientLayout } from "@/shared/layout/ClientLayout";
import "./globals.css";

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
        className="font-pretendard antialiased"
        suppressHydrationWarning
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
