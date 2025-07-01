import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ledger Dashboard",
  description: "Financial ledger management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} min-h-screen bg-background font-sans antialiased`}
      >
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
