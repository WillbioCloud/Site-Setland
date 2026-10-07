import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`button button--${variant} button--${size} ${fullWidth ? 'button--full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
