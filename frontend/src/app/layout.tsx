import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/context/ThemeContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MiniBank - Banco Digital',
  description: 'Sistema bancário completo com investimentos e controle financeiro',
  manifest: '/manifest.json',
  themeColor: '#4da8ff',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'MiniBank' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
