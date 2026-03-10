import Link from "next/link";
import { ComponentProps } from "react";
import { useParams } from 'next/navigation'

interface NavLinkProps extends ComponentProps<typeof Link> {
    children: React.ReactNode;
    href: string;
}

export default function NavLink({ children, href, ...props }: NavLinkProps) {
    const params = useParams();
    let classes = "text-lg hover:underline ";
    params.gender === children?.toString().toLowerCase() ? classes += "font-bold underline" : classes += "";
    params.garmentType === children?.toString().toLowerCase() ? classes += "font-bold underline" : classes += "";

    return (
        <Link href={href} className={classes} {...props}>
            {children}
        </Link>
    )
}
