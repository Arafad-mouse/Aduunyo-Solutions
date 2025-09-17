import * as React from "react"
import { cn } from "@/lib/utils"

const Footer = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <footer
    ref={ref}
    className={cn("border-t bg-background", className)}
    {...props}
  />
))
Footer.displayName = "Footer"

const FooterContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4 lg:py-16",
      className
    )}
    {...props}
  />
))
FooterContent.displayName = "FooterContent"

const FooterColumn = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-3", className)}
    {...props}
  />
))
FooterColumn.displayName = "FooterColumn"

const FooterBottom = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-between gap-4 border-t px-6 py-6 md:flex-row",
      className
    )}
    {...props}
  />
))
FooterBottom.displayName = "FooterBottom"

export { Footer, FooterContent, FooterColumn, FooterBottom }
