import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marissa’s Little Café",
  description: "A cozy place for coffee, faith, and little companions.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
