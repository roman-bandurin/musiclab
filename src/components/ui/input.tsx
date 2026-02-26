import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className, type, ...props
  }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex w-full border-0 border-b border-[#d0cece] bg-transparent px-0 py-2 text-lg leading-[1.33] tracking-[-0.003em] text-black placeholder:text-[#d0cece] transition-colors',
        'hover:border-[#3f007d] hover:shadow-[inset_0_-1px_0_0_#3f007d]',
        'focus:outline-none focus:border-[#271a58] focus:shadow-[inset_0_-1px_0_0_#271a58]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export { Input }
