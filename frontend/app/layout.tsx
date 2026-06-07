import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "India Equity Dashboard",
  description: "Stock analysis dashboard for India-listed equities",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#080d1a] text-[#e8edf7] antialiased">
        {children}
      </body>
    </html>
  );
}
