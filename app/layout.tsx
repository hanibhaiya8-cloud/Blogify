import type { Metadata } from 'next'
import './styles/globals.css'
import { ThemeProvider } from '@/app/lib/providers'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Blogify - Profile Showcase',
  description: 'A modern profile showcase and management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          storageKey="blogify-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
