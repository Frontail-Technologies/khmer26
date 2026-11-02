/**
 * Tiny global store for the "Sign in to continue" prompt, so any link, button or hook can open it
 * without prop drilling or a context provider. `returnTo` is where sign-in sends the visitor back.
 */
let returnTo: string | null = null
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribeSignInPrompt(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSignInPromptReturnTo() {
  return returnTo
}

export function safeReturnTo(path: string | null | undefined): string {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : "/"
}

export function openSignInPrompt(path?: string) {
  returnTo = safeReturnTo(path ?? (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/"))
  emit()
}

export function closeSignInPrompt() {
  if (returnTo === null) return
  returnTo = null
  emit()
}
