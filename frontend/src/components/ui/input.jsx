import * as React from "react"

const Input = React.forwardRef(({ className, type, style, ...props }, ref) => {
  const inputStyles = {
    display: 'block',
    width: '100%',
    height: '2.5rem',
    borderRadius: '0.375rem',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--input)',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    transition: 'all 0.15s ease-in-out',
    outline: 'none',
    ...style
  };

  return (
    <input
      type={type}
      style={inputStyles}
      className={className}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
