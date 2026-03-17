import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Cargamos la fuente elegante y moderna con sus diferentes grosores
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Oakscale | Brand Portfolio",
  description: "Discover premium franchise opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* antialiased hace que la letra se vea mucho más suave y fina en pantallas modernas */}
      <body className={`${plusJakarta.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}