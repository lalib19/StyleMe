import Link from "next/link";
import { ComponentProps } from "react";

interface NavLinkProps extends ComponentProps<typeof Link> {
    children: React.ReactNode;
    href: string;
}

export default function NavLink({ children, href, ...props }: NavLinkProps) {
    return (
        <Link href={href} className="text-lg hover:underline" {...props}>
            {children}
        </Link>
    )
}
