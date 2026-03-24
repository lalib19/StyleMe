import { ReactNode, ButtonHTMLAttributes } from 'react';

export default function Button({
    children,
    className,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode
}) {
    const classes = `px-4 py-2 text-md md:text-base rounded-md bg-sky-300 hover:bg-sky-400 hover:cursor-pointer ${className || ""}`
    const disabledClasses = "opacity-50 cursor-not-allowed hover:bg-sky-200"

    return (
        <button
            className={classes + (props.disabled ? ` ${disabledClasses}` : "")}
            {...props}
        >
            {children}
        </button>
    )
}