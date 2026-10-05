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
  Key,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/hooks/use-admin-auth"

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { login, isLoggingIn } = useAdminAuth()

  const handleFillDemoAdmin = () => {
    setEmail("admin@khmer26.com")
    setPassword("Admin@Khmer26!")
    setErrorMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage("Please enter your email and password.")
      return
    }

    try {
      await login({ email, password })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Invalid credentials.")
    }
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
            </Link>
          </div>
          <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Sign In
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Sign in to manage the marketplace, review listings, and oversee moderation.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-7 space-y-4">
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-primary/20 bg-primary/5 text-xs text-foreground">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-primary shrink-0" weight="bold" />
              <div>
                <p className="font-semibold text-[11px] text-foreground">Demo Account</p>
                <p className="text-[10px] text-muted-foreground">admin@khmer26.com</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFillDemoAdmin}
              className="h-7 px-2.5 text-[11px] font-medium border-primary/30 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
            >
              Fill Credentials
            </Button>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium leading-relaxed">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field className="gap-2">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative">
                <EnvelopeSimple
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="email"
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
                <FieldLabel htmlFor="password">Password</FieldLabel>
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
                  id="password"
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
              disabled={isLoggingIn}
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs sm:text-sm rounded-md shadow-xs cursor-pointer transition-colors mt-1"
            >
              {isLoggingIn ? (
                <span className="flex items-center justify-center gap-2">
                  <SpinnerGap size={16} className="animate-spin" />
                  <span>Verifying credentials...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShieldCheck size={16} weight="bold" />
                  <span>Sign In</span>
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
