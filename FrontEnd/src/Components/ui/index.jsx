import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Button Component
 */
export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn('ui-button', `ui-button--${variant}`, `ui-button--${size}`, className)}
      {...props}
    />
  );
});

/**
 * Card Component
 */
export const Card = ({ className, children, ...props }) => {
  return (
    <div className={cn('ui-card', className)} {...props}>
      {children}
    </div>
  );
};

/**
 * Input Component
 */
export const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="ui-input-group">
      {label && <label className="ui-label">{label}</label>}
      <input
        ref={ref}
        className={cn('ui-input', error && 'ui-input--error', className)}
        {...props}
      />
      {error && <span className="ui-error-text">{error}</span>}
    </div>
  );
});

/**
 * Badge Component
 */
export const Badge = ({ className, variant = 'primary', children, ...props }) => {
  return (
    <span className={cn('ui-badge', `ui-badge--${variant}`, className)} {...props}>
      {children}
    </span>
  );
};
