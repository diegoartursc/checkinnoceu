// src/components/ui/Button.tsx
import React, { memo } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  className?: string;
}

const Button = memo(({ children, onClick, color = "bg-gradient-to-b from-blue-400 to-blue-600", className = "", disabled, ...props }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      color,
      "text-white font-black py-4 px-8 rounded-3xl border-b-6 border-opacity-50 shadow-xl",
      "active:border-b-0 active:translate-y-2 transition-all transform",
      "hover:scale-105 hover:shadow-2xl",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "flex items-center justify-center gap-2",
      className
    )}
    {...props}
  >
    {children}
  </button>
));

Button.displayName = 'Button';

export default Button;
