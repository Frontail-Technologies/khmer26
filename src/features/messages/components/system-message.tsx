interface SystemMessageProps {
  content: string
}

export function SystemMessage({ content }: SystemMessageProps) {
  return (
    <div className="flex justify-center my-3">
      <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-[11px] font-semibold text-center max-w-md shadow-2xs border border-border/50">
        {content}
      </span>
    </div>
  )
}
