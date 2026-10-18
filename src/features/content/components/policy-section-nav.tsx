"use client"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface PolicySectionLink {
  id: string
  title: string
}

export function PolicySectionNav({
  title,
  sections,
}: {
  title: string
  sections: PolicySectionLink[]
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "")

  useEffect(() => {
    if (!sections.length) return

    let frame = 0
    const updateActiveSection = () => {
      frame = 0
      const headerOffset = 120
      let nextId = sections[0]?.id ?? ""

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element && element.getBoundingClientRect().top <= headerOffset) {
          nextId = section.id
        }
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        nextId = sections.at(-1)?.id ?? nextId
      }
      setActiveId(nextId)
    }

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection)
    }
    frame = window.requestAnimationFrame(() => {
      const hashId = decodeURIComponent(window.location.hash.slice(1))
      if (sections.some((section) => section.id === hashId)) setActiveId(hashId)
      else updateActiveSection()
    })

    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    window.addEventListener("hashchange", scheduleUpdate)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      window.removeEventListener("hashchange", scheduleUpdate)
    }
  }, [sections])

  return (
    <nav aria-label={`${title} sections`} className="lg:sticky lg:top-24 lg:self-start">
      <p className="mb-3 text-sm font-semibold text-foreground"><LocalizedText id="onThisPage" /></p>
      <ol className="space-y-1 border-l border-border">
        {sections.map((section) => {
          const isActive = activeId === section.id
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveId(section.id)}
                className={cn(
                  "-ml-px block border-l-2 px-4 py-1.5 text-sm leading-5 transition-colors",
                  isActive
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {section.title}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
