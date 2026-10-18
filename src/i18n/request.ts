import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "./config"

/** Resolves the visitor's locale from the cookie and loads that language's messages. */
export default getRequestConfig(async () => {
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value
  const locale = isLocale(stored) ? stored : DEFAULT_LOCALE

  return {
    locale,
    timeZone: "Asia/Phnom_Penh",
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
