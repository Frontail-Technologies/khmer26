"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Lock,
  EnvelopeSimple,
  Eye,
  EyeSlash,
  ShieldCheck,
  ArrowSquareOut,
  SpinnerGap,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage("Please enter your admin email and password.")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setErrorMessage("Admin authentication requires server verification. Connect backend credentials.")
    }, 600)
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <Card className="rounded-xl border border-border/70 bg-card p-0 shadow-sm text-foreground overflow-hidden">
        <CardHeader className="p-5 sm:p-7 pb-4 text-center border-b border-border/60 bg-muted/15">
          <div className="flex justify-center mb-2.5">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Khmer26"
                width={110}
                height={28}
                priority
                style={{ width: "auto" }}
                className="h-6 w-auto object-contain"
              />
              <Badge
                variant="secondary"
                className="h-4.5 px-1.5 text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20"
              >
                Admin
              </Badge>
            </Link>
          </div>
          <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Sign in to manage the marketplace, review listings, and oversee moderation.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-7 space-y-4">
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium leading-relaxed">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field className="gap-2">
              <FieldLabel htmlFor="admin-email">Admin Email</FieldLabel>
              <div className="relative">
                <EnvelopeSimple
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@khmer26.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9.5 pl-9 text-xs sm:text-sm bg-background"
                  required
                />
              </div>
            </Field>

            <Field className="gap-2">
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="admin-password">Password</FieldLabel>
                <span className="text-[10px] text-muted-foreground">
                  Internal accounts only
                </span>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9.5 pl-9 pr-9 text-xs sm:text-sm bg-background font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeSlash size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs sm:text-sm rounded-md shadow-xs cursor-pointer transition-colors mt-1"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <SpinnerGap size={16} className="animate-spin" />
                  <span>Verifying credentials...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShieldCheck size={16} weight="bold" />
                  <span>Sign In to Admin</span>
                </span>
              )}
            </Button>
          </form>

          <div className="pt-1 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors hover:underline"
            >
              <ArrowSquareOut size={13} />
              <span>Back to Khmer26 Marketplace</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
