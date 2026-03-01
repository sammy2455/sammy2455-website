import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <Navbar />
        <main style={{ paddingTop: "64px", minHeight: "100vh" }}>{children}</main>
        <Footer />
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
