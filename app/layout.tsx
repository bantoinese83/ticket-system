"use client"

import { Inter } from "next/font/google"
import { Provider } from "react-redux"
import { store } from "./store/store"
import { Toaster } from "@/components/ui/toaster"
import { NavBar } from "./components/nav-bar"
import { Breadcrumbs } from "./components/breadcrumbs"
import "./globals.css"
import {ThemeProvider} from "@/app/components/theme-provider";
import React from "react";

const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Provider store={store}>
            <div className="min-h-screen bg-background">
              <NavBar />
              <main className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
                {children}
              </main>
            </div>
            <Toaster />
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
