export function formatAdCount(count: number): string {
  return `${count.toLocaleString()} ${count === 1 ? "ad" : "ads"}`
}
