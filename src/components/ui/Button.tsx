import { ReactNode, ButtonHTMLAttributes } from 'react';

export default function Button({
    children,
    className,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode
}) {
    const classes = `px-4 py-2 text-sm md:text-base rounded-md bg-green-100 hover:bg-green-200 ${className || ""}`

    return (
        <button
            className={classes}
            {...props}
        >
            {children}
        </button>
    )
}