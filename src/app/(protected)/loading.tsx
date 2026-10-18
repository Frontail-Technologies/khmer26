import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { LoadingState } from "@/components/shared/LoadingState"

/** Shown while a signed-in route (account, messages, post ad) streams in. */
export default function ProtectedLoading() {
  const tGenerated = useTranslations("generated")
  return (
    <Container className="py-6">
      <div aria-busy="true" aria-label={tGenerated("loading_8f26c6")}>
        <LoadingState variant="list" count={5} />
      </div>
    </Container>
  )
}
