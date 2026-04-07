import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "font-main inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow hover:bg-primary/90 active:scale-95",
        primary: "bg-primary text-white shadow hover:bg-primary/90 active:scale-95",
        palmPrimary:
          "relative isolate overflow-hidden border-2 border-primary text-white shadow-md active:scale-95 before:absolute before:inset-0 before:-z-[2] before:bg-primary before:content-[''] after:absolute after:bottom-0 after:-left-[10%] after:-z-[1] after:h-[150%] after:w-[120%] after:translate-y-full after:rounded-[50%_50%_0_0] after:bg-secondary/80 after:transition-transform after:duration-[600ms] after:ease-[cubic-bezier(0.23,1,0.32,1)] after:content-[''] hover:after:translate-y-0",
        palmSecondary:
          "relative isolate overflow-hidden border-2 border-primary bg-transparent text-primary active:scale-95 hover:text-white before:absolute before:inset-0 before:-z-[2] before:bg-transparent before:content-[''] after:absolute after:bottom-0 after:-left-[10%] after:-z-[1] after:h-[150%] after:w-[120%] after:translate-y-full after:rounded-[50%_50%_0_0] after:bg-primary after:transition-transform after:duration-[600ms] after:ease-[cubic-bezier(0.23,1,0.32,1)] after:content-[''] hover:after:translate-y-0",
        palmDanger:
          "relative isolate overflow-hidden border-2 border-red-600 text-white shadow-md active:scale-95 before:absolute before:inset-0 before:-z-[2] before:bg-red-600 before:content-[''] after:absolute after:bottom-0 after:-left-[10%] after:-z-[1] after:h-[150%] after:w-[120%] after:translate-y-full after:rounded-[50%_50%_0_0] after:bg-red-700 after:transition-transform after:duration-[600ms] after:ease-[cubic-bezier(0.23,1,0.32,1)] after:content-[''] hover:after:translate-y-0 dark:border-red-500 dark:before:bg-red-500 dark:after:bg-red-600",
        outline:
          "border-border bg-background text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-white shadow hover:bg-secondary/90 active:scale-95",
        ghost: "text-primary hover:bg-primary/10",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        light: "bg-primary/10 text-primary hover:bg-primary/20 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 rounded-full px-8 py-3 pb-2 text-base",
        xs: "h-6 rounded-full px-2 text-xs",
        sm: "h-9 rounded-full px-3 text-xs",
        lg: "h-14 rounded-full px-10 py-5 pb-4 text-lg",
        icon: "h-9 w-9 rounded-full",
        "icon-xs": "h-6 w-6 rounded-full",
        "icon-sm": "h-7 w-7 rounded-full",
        "icon-lg": "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "palmPrimary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
