import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NextAuthProvider } from "@/components/providers/next-auth-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VC Tracker - Project Management Platform",
  description: "A comprehensive project management platform for teams and organizations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <QueryProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
