import type en from "../../messages/en.json"
import type { Locale } from "./config"

// English is the source of truth: every key used with useTranslations/getTranslations is checked
// against it at compile time. Khmer must mirror it (enforced by the key-parity test).
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale
    Messages: typeof en
  }
}
