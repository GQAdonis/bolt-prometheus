import * as React from "react"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { cn } from "~/lib/utils"
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/ui/tooltip"

const sidebarVariants = cva(
  "flex flex-col gap-4 p-4 bg-background border-r",
  {
    variants: {
      variant: {
        default: "w-[300px]",
        sm: "w-[250px]",
        lg: "w-[350px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

function Sidebar({ className, variant, ...props }: SidebarProps) {
  return (
    <div className={cn(sidebarVariants({ variant }), className)} {...props} />
  )
}

interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  tooltip?: string
}

function SidebarItem({ className, tooltip, children, ...props }: SidebarItemProps) {
  const content = (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

export { Sidebar, SidebarItem }
