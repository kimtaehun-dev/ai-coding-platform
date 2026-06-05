import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/app-init/providers/theme-provider'

export const metadata: Metadata = {
  title: 'AI Coding Test Trainer',
  description: 'AI 기반 코딩테스트 학습 플랫폼',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
