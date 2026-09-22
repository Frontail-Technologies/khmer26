"use client"

import { Container } from "@/components/layout/Container"
import { Section } from "@/components/layout/Section"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <Container size="narrow">
      <Section spacing="xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-7xl font-bold text-primary">404</p>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Page Not Found
            </h1>
            <p className="text-sm text-muted-foreground">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>
          <div className="flex gap-3">
            <Button render={<Link href="/">Go Home</Link>} />
            <Button
              variant="outline"
              render={<Link href="/categories">Browse Categories</Link>}
            />
          </div>
        </div>
      </Section>
    </Container>
  )
}
