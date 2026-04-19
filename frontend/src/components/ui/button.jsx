import * as React from "react"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, style, ...props }, ref) => {
  const getStyles = () => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.15s ease-in-out',
      cursor: 'pointer',
      border: 'none',
      padding: '0.5rem 1rem',
      textDecoration: 'none',
      ...style
    };

    const variantStyles = {
      default: {
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
      },
      destructive: {
        backgroundColor: 'var(--destructive)',
        color: 'var(--destructive-foreground)',
      },
      outline: {
        border: '1px solid var(--border)',
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      },
      secondary: {
        backgroundColor: 'var(--secondary)',
        color: 'var(--secondary-foreground)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--foreground)',
      },
      link: {
        color: 'var(--primary)',
        textDecoration: 'underline',
        textDecorationOffset: '4px',
      },
    };

    const sizeStyles = {
      default: {
        height: '2.5rem',
        padding: '0.5rem 1rem',
      },
      sm: {
        height: '2.25rem',
        padding: '0.25rem 0.75rem',
        fontSize: '0.8125rem',
      },
      lg: {
        height: '2.75rem',
        padding: '0 2rem',
        fontSize: '1rem',
      },
      icon: {
        height: '2.5rem',
        width: '2.5rem',
        padding: '0',
      },
    };

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
    };
  };

  const Comp = asChild ? "span" : "button"
  return (
    <Comp
      style={getStyles()}
      className={className}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
