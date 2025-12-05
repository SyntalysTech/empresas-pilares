import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Whitelist - Empresas Pilares",
  description: "Sistema de análisis y seguimiento de empresas con ventajas competitivas sostenibles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme) {
                    if (theme === 'dark') {
                      document.documentElement.classList.add('dark');
                    } else if (theme === 'midnight') {
                      document.documentElement.classList.add('dark', 'theme-midnight');
                    } else if (theme === 'forest') {
                      document.documentElement.classList.add('dark', 'theme-forest');
                    } else if (theme === 'sunset') {
                      document.documentElement.classList.add('dark', 'theme-sunset');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
