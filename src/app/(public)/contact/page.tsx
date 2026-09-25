"use client"

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

const SUBJECT_OPTIONS = [
  { value: "general", label: "General Inquiry" },
  { value: "feedback", label: "Product Feedback & Suggestions" },
  { value: "report_issue", label: "Report a Technical Problem" },
  { value: "verification", label: "Account Verification Support" },
  { value: "business", label: "Business & Dealership Inquiries" },
]

function ContactForm() {
  const searchParams = useSearchParams()
  const defaultSubject =
    searchParams.get("type") === "feedback" ? "feedback" : "general"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState(defaultSubject)
  const [message, setMessage] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      <div className="md:col-span-5 space-y-4">
        <Card className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-foreground">
              Contact Information
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Have questions or suggestions for Khmer26? Our local support team in
              Phnom Penh is here to assist you.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <EnvelopeSimple size={16} weight="bold" />
              </div>
              <div>
                <span className="font-semibold text-foreground block">Email Us</span>
                <span className="text-muted-foreground">support@khmer26.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <Phone size={16} weight="bold" />
              </div>
              <div>
                <span className="font-semibold text-foreground block">Customer Hotline</span>
                <span className="text-muted-foreground">+855 23 999 826</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <MapPin size={16} weight="bold" />
              </div>
              <div>
                <span className="font-semibold text-foreground block">Headquarters</span>
                <span className="text-muted-foreground">
                  Khan Chamkarmon, Phnom Penh, Cambodia
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="md:col-span-7">
        <Card className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-2xs">
          {isSubmitted ? (
            <div className="py-10 text-center space-y-3 animate-in fade-in duration-300">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle size={28} weight="fill" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Message Sent Successfully
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out to Khmer26. Our team has received your note
                and will review your inquiry shortly.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSubmitted(false)
                  setName("")
                  setEmail("")
                  setMessage("")
                }}
                className="text-xs font-semibold h-9 mt-2 cursor-pointer"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-foreground">
                  Send a Message
                </h2>
                <p className="text-xs text-muted-foreground">
                  Fill out the form below and we will respond as soon as possible.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <Field>
                  <FieldLabel required>Your Name</FieldLabel>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sokha Chan"
                    className="w-full h-9 px-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </Field>

                <Field>
                  <FieldLabel required>Email Address</FieldLabel>
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
                <FieldLabel required>Inquiry Subject</FieldLabel>
                <Select
                  value={subject}
                  items={SUBJECT_OPTIONS}
                  onValueChange={(val) => {
                    if (val) setSubject(val)
                  }}
                >
                  <SelectTrigger className="h-9 text-xs w-full">
                    <SelectValue placeholder="Select topic">
                      {(val) =>
                        getSelectOptionLabel(
                          SUBJECT_OPTIONS,
                          val,
                          "General Inquiry"
                        )
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECT_OPTIONS.map((opt) => (
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
                <FieldLabel required>Your Message</FieldLabel>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry or feedback in detail..."
                  className="w-full p-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none leading-relaxed"
                />
              </Field>

              <Button
                type="submit"
                className="w-full sm:w-auto h-9 px-5 text-xs font-bold gap-1.5 cursor-pointer"
              >
                <PaperPlaneTilt size={14} weight="bold" />
                <span>Submit Inquiry</span>
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
              Khmer26 Support
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Contact & Feedback
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We value your suggestions and are here to help with any marketplace
            questions.
          </p>
        </div>

        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </div>
    </Container>
  )
}
