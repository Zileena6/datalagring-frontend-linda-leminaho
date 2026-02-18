import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import QueryProvider from '@/providers/query-provider';
import { Themeprovider } from '@/providers/theme-provider';
import Header from '@/components/header/Header';
import Container from '@/components/global/Container';
import Footer from '@/components/footer/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EduCraft',
  description: 'Education System Manager',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <QueryProvider>
          <Themeprovider attribute='class' enableSystem defaultTheme='system'>
            <Header />
            <Container>{children}</Container>
            <Footer />
          </Themeprovider>
        </QueryProvider>
      </body>
    </html>
  );
}
