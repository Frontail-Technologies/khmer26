"use client"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  align = "start",
  side = "bottom",
  sideOffset = 6,
  className,
  children,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, "align" | "side" | "sideOffset">) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner className="isolate z-50 outline-none" align={align} side={side} sideOffset={sideOffset}>
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "max-h-[min(32rem,var(--available-height))] w-72 overflow-y-auto rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-xl outline-none",
            className
          )}
          {...props}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
