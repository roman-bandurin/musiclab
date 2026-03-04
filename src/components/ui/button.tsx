import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[#580ea2] text-white hover:bg-[#3f007d] active:bg-[#271a58] focus-visible:ring-[#3f007d]',
        secondary:
          'bg-white border border-[#d0cece] text-black hover:bg-[#f4f5f6] active:bg-[#d9d9d9] focus-visible:ring-[#d0cece]',
      },
      size: {
        default: 'min-h-12 w-full px-4 py-3.5 text-lg',
        sm: 'h-9 rounded-md px-3 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className, variant, size, ...props
  }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({
        variant, size, className,
      }))}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export {
  Button, buttonVariants,
}
