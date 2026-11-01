/**
 * Keeps a table's "actions" column pinned to the right edge with an opaque background, so row
 * actions stay visible however wide the table gets.
 */
export function actionColumnClass(columnId: string, part: "head" | "cell" = "cell"): string | undefined {
  if (columnId !== "actions") return undefined
  return part === "head"
    ? "sticky right-0 z-10 w-px whitespace-nowrap bg-muted shadow-[inset_1px_0_0_var(--color-border)]"
    : "sticky right-0 z-10 w-px whitespace-nowrap bg-card shadow-[inset_1px_0_0_var(--color-border)]"
}
