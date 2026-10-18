"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import {
  EnvelopeSimple,
  Phone,
  MapPin,
  PaperPlaneTilt,
  CheckCircle,
  ChatCircleText,
} from "@phosphor-icons/react"
import { createSupportSubmission, type SupportSubject } from "@/features/support/api/support.api"
import type { GeneratedMessageKey } from "@/i18n/message-types"

const SUBJECT_OPTIONS: Array<{ value: SupportSubject; messageKey: GeneratedMessageKey }> = [
  { value: "general", messageKey: "generalInquiry" },
  { value: "feedback", messageKey: "productFeedbackSuggestions" },
  { value: "report_issue", messageKey: "reportATechnicalProblem" },
  { value: "verification", messageKey: "accountVerificationSupport" },
  { value: "business", messageKey: "businessDealershipInquiries" },
]

function ContactForm() {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const subjectOptions = SUBJECT_OPTIONS.map((option) => ({
    value: option.value,
    label: tGenerated(option.messageKey),
  }))
  const searchParams = useSearchParams()
  const defaultSubject =
    searchParams.get("type") === "feedback" ? "feedback" : "general"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState<SupportSubject>(defaultSubject)
  const [message, setMessage] = useState("")
  const [reference, setReference] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      const submission = await createSupportSubmission({ name, email, subject, message, website: "" })
      setReference(submission.displayId)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We could not send your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      <div className="md:col-span-5 space-y-4">
        <Card className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-foreground">
            <LocalizedText id="contactInformation" />
          </h2>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <EnvelopeSimple size={16} weight="bold" />
              </div>
              <div>
                <span className="font-semibold text-foreground block"><LocalizedText id="emailUs" /></span>
                <span className="text-muted-foreground">support@khmer26.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <Phone size={16} weight="bold" />
              </div>
              <div>
                <span className="font-semibold text-foreground block"><LocalizedText id="customerHotline" /></span>
                <span className="text-muted-foreground">+855 23 999 826</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <MapPin size={16} weight="bold" />
              </div>
              <div>
                <span className="font-semibold text-foreground block"><LocalizedText id="headquarters" /></span>
                <span className="text-muted-foreground">
                  <LocalizedText id="khanChamkarmonPhnomPenhCambodia" />
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="md:col-span-7">
        <Card className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-2xs">
          {reference ? (
            <div className="py-10 text-center space-y-3 animate-in fade-in duration-300">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle size={28} weight="fill" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                <LocalizedText id="messageSentSuccessfully" />
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                <LocalizedText id="thankYouForReachingOutToKhmer26OurTeam" />
              </p>
              <p className="text-xs font-semibold text-foreground">
                {tDynamic("reference", { reference })}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setReference("")
                  setName("")
                  setEmail("")
                  setMessage("")
                }}
                className="text-xs font-semibold h-9 mt-2 cursor-pointer"
              >
                <LocalizedText id="sendAnotherMessage" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="text-base font-bold text-foreground">
                <LocalizedText id="sendAMessage" />
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <Field>
                  <FieldLabel required><LocalizedText id="yourName" /></FieldLabel>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={tGenerated("eGSokhaChan")}
                    className="w-full h-9 px-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </Field>

                <Field>
                  <FieldLabel required><LocalizedText id="emailAddress" /></FieldLabel>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-9 px-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel required><LocalizedText id="inquirySubject" /></FieldLabel>
                <Select
                  value={subject}
                  items={subjectOptions}
                  onValueChange={(val) => {
                    if (val) setSubject(val as SupportSubject)
                  }}
                >
                  <SelectTrigger className="h-9 text-xs w-full">
                    <SelectValue placeholder={tGenerated("selectTopic")}>
                      {(val) =>
                        getSelectOptionLabel(
                          subjectOptions,
                          val,
                          "General Inquiry"
                        )
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="text-xs"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel required><LocalizedText id="yourMessage" /></FieldLabel>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={tGenerated("describeYourInquiryOrFeedbackInDetail")}
                  className="w-full p-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none leading-relaxed"
                />
              </Field>

              {error && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto h-9 px-5 text-xs font-bold gap-1.5 cursor-pointer"
              >
                <PaperPlaneTilt size={14} weight="bold" />
                <span>{isSubmitting ? tGenerated("sending") : tGenerated("submitInquiry")}</span>
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Container>
      <div className="py-6 sm:py-10 max-w-4xl mx-auto space-y-6 pb-16 md:pb-12">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start text-primary">
            <ChatCircleText size={22} weight="duotone" />
            <span className="text-xs font-bold uppercase tracking-wider">
              <LocalizedText id="khmer26Support" />
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            <LocalizedText id="contactFeedback" />
          </h1>
        </div>

        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </div>
    </Container>
  )
}
