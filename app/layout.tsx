import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "./pwa-register";

export const metadata: Metadata = {
  title: "Sip & Wonder",
  description: "A cozy world of coffee, faith, and magical Siplings.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Sip & Wonder", statusBarStyle: "default" },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#faf7f2" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><PwaRegister />{children}</body>
    </html>
  );
}
