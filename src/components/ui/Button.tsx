import { ReactNode, ButtonHTMLAttributes } from 'react';

export default function Button({
    children,
    className,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode
}) {
    const classes = `px-4 py-2 text-md md:text-base rounded-md bg-green-100 hover:bg-green-200 hover:cursor-pointer ${className || ""}`
    const disabledClasses = "opacity-50 cursor-not-allowed hover:bg-green-100"

    return (
        <button
            className={classes + (props.disabled ? ` ${disabledClasses}` : "")}
            {...props}
        >
            {children}
        </button>
    )
}