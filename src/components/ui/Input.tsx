import { InputHTMLAttributes, Ref } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    className?: string;
    htmlFor?: string;
    ref?: Ref<HTMLInputElement>;
}

export default function Input({ htmlFor, label, ref, className, ...props }: InputProps) {
    const classes =
        `${className} w-full p-1 border-b-2 border-stone-300 rounded-sm bg-stone-100 focus:outline-none focus:border-stone-600`;

    return (
        <div className='flex flex-col items-center'>
            <label className='' htmlFor={htmlFor}>{label}</label>
            <input
                className={classes}
                ref={ref}
                {...props}
            />
        </div>
    );
}