import React, { memo } from 'react';

/**
 * Physical 3D Button Component (Candy Crush / Royal Match Style)
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {'primary'|'success'|'warning'|'danger'|'secondary'|'gold'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'|'xl'} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 * @param {React.Component} props.icon - Lucide icon component
 */
const Button = memo(({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-b from-blue-400 to-blue-600 border-blue-700 text-white shadow-[0_6px_0_0_rgb(29,78,216)] active:shadow-[0_2px_0_0_rgb(29,78,216)]',
    success: 'bg-gradient-to-b from-green-400 to-green-600 border-green-700 text-white shadow-[0_6px_0_0_rgb(21,128,61)] active:shadow-[0_2px_0_0_rgb(21,128,61)]',
    warning: 'bg-gradient-to-b from-orange-400 to-orange-600 border-orange-700 text-white shadow-[0_6px_0_0_rgb(194,65,12)] active:shadow-[0_2px_0_0_rgb(194,65,12)]',
    danger: 'bg-gradient-to-b from-red-400 to-red-600 border-red-700 text-white shadow-[0_6px_0_0_rgb(185,28,28)] active:shadow-[0_2px_0_0_rgb(185,28,28)]',
    secondary: 'bg-gradient-to-b from-slate-300 to-slate-500 border-slate-600 text-slate-900 shadow-[0_6px_0_0_rgb(71,85,105)] active:shadow-[0_2px_0_0_rgb(71,85,105)]',
    gold: 'bg-gradient-to-b from-yellow-300 to-yellow-500 border-yellow-600 text-yellow-900 shadow-[0_6px_0_0_rgb(202,138,4)] active:shadow-[0_2px_0_0_rgb(202,138,4)]'
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
    xl: 'px-8 py-5 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        border-b-4 rounded-xl font-black uppercase tracking-wide
        transition-all duration-150 ease-out
        active:translate-y-1 active:border-b-0
        hover:brightness-110
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : 28} strokeWidth={2.5} />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
