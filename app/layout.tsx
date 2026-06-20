import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './style.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'SMK Ma\'arif NU 01 Karangkobar',
    template: '%s | SMK Ma\'arif NU 01 Karangkobar',
  },
  description:
    'Website resmi SMK Ma\'arif NU 01 Karangkobar — Sekolah Menengah Kejuruan berbasis Islam NU di Karangkobar, Banjarnegara. Program Keahlian: TBSM, TJKT, AKL.',
  keywords: [
    'SMK Ma\'arif NU',
    'Karangkobar',
    'Banjarnegara',
    'PPDB',
    'TBSM',
    'TJKT',
    'AKL',
    'LP Ma\'arif NU',
  ],
  authors: [{ name: 'SMK Ma\'arif NU 01 Karangkobar' }],
  creator: 'SMK Ma\'arif NU 01 Karangkobar',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.smkmaarifnu01karangkobar.sch.id'
  ),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'SMK Ma\'arif NU 01 Karangkobar',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased text-base min-w-[320px]`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
