import type { Metadata } from 'next'
import { GoogleAnalytics } from '@/components/analytics'
import './globals.css'

export const metadata: Metadata = {
  title: 'RFI Tracker - Construction RFI Management Software',
  description: 'Stop losing RFIs in email. Track every question and answer in one place. Built for contractors who don\'t need Procore.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
