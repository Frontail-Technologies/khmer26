import { Container } from "@/components/layout/Container"
import { HomeContent } from "@/features/home/components/home-content"

export default function HomePage() {
  return (
    <Container>
      <div className="pb-16 md:pb-6">
        <HomeContent />
      </div>
    </Container>
  )
}
