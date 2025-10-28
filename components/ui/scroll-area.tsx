"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaThumb>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaThumb>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaThumb
    ref={ref}
    className={cn(
      "focus-visible:ring-ring size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 bg-border",
      className,
    )}
    {...props}
  />
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaThumb.displayName

export { ScrollArea, ScrollBar }
