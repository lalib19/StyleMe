import './globals.css';
import type { Metadata } from "next";
import SessionProvider from "../lib/SessionProvider";
import MainNavigation from '../components/layout/main-navigation';
import ReduxProvider from '../lib/ReduxProvider';
import FavoritesProvider from '../components/favorites-provider';
import FilterNavigation from '../components/layout/filter-navigation';

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
            <FavoritesProvider />
            <MainNavigation />
            <FilterNavigation />
            {children}
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
