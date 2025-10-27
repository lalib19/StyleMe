import './globals.css';
import type { Metadata } from "next";
import SessionProvider from "../lib/SessionProvider";
import MainNavigation from '../components/layout/main-navigation';

export const metadata: Metadata = {
  title: "Linguistica",
  description: "Learn languages",
  keywords: ["language", "learning", "linguistics", "education"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <MainNavigation />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
