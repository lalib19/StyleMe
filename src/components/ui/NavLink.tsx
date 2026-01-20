import Link from "next/link";
import { ComponentProps } from "react";
import { useParams } from 'next/navigation'

interface NavLinkProps extends ComponentProps<typeof Link> {
    children: React.ReactNode;
    href: string;
}

export default function NavLink({ children, href, ...props }: NavLinkProps) {
    const params = useParams();
    let classes = "";
    params.gender === children?.toString().toLowerCase() ? classes = "text-lg font-bold underline" : classes = "text-lg hover:underline";

    return (
        <Link href={href} className={classes} {...props}>
            {children}
        </Link>
    )
}
