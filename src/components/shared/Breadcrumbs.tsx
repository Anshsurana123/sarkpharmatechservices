import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-2 flex-wrap">
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Home className="h-3.5 w-3.5" />
            </Link>
            {crumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1">
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    {crumb.href && i < crumbs.length - 1 ? (
                        <Link href={crumb.href} className="hover:text-primary transition-colors">
                            {crumb.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-medium truncate max-w-[200px]">{crumb.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
