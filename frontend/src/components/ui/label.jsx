import * as React from "react"

const Label = React.forwardRef(({ className, style, ...props }, ref) => {
  const labelStyles = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    lineHeight: '1.25',
    ...style
  };

  return (
    <label
      style={labelStyles}
      className={className}
      ref={ref}
      {...props}
    />
  )
})
Label.displayName = "Label"

export { Label }
