import './globals.css';
import type { Metadata } from "next";
import SessionProvider from "../lib/SessionProvider";
import MainNavigation from '../components/layout/main-navigation';
import ReduxProvider from '../lib/ReduxProvider';

export const metadata: Metadata = {
  title: "StyleMe",
  description: "Style yourself in your favorite clothes using AI",
  keywords: ["clothing", "fashion", "AI", "store"],
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
          <ReduxProvider>
            <MainNavigation />
            {children}
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
