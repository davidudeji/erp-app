import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ERP Suite - Enterprise Resource Planning",
    template: "%s | ERP Suite",
  },
  description:
    "ERP Suite is a unified enterprise operating system for modern businesses — inventory, POS, finance, operations, analytics, and AI workflows in one platform.",
  keywords: ["ERP", "enterprise", "inventory", "finance", "operations"],
  authors: [{ name: "ERP Suite" }],
  openGraph: {
    title: "ERP Suite - Enterprise Resource Planning",
    description: "Unified enterprise operating system for modern businesses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
