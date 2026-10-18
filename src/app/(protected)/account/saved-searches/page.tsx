import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { SavedSearchesView } from '@/features/account/saved-searches/components/saved-searches-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.savedSearches")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function SavedSearchesPage() {
  return <SavedSearchesView />;
}
