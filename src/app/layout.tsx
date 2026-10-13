import type { Metadata } from "next";
import { Lato, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700", "900"], variable: "--font-lato" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic", "normal"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Womentor",
  description: "For Women by Women",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lato.variable} ${montserrat.variable} ${playfair.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
