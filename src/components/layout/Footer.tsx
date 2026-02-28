import Link from "next/link";
import { ShieldCheck, Mail, Globe, Phone, MessageCircle } from "lucide-react";

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t bg-background mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-secondary/80 flex items-center justify-center">
                                <ShieldCheck className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-base bg-gradient-to-r from-primary to-secondary dark:from-primary dark:to-primary/60 bg-clip-text text-transparent">
                                Sark Pharma Tech Services
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Professional pharmaceutical SOPs and regulatory intelligence for GMP-compliant operations.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {[
                                { label: 'SOP Database', href: '/sops' },
                                { label: 'Bundles & Packages', href: '/bundles' },
                                { label: 'Courses & Training', href: '/courses' },
                                { label: 'Regulatory Insights', href: '/insights' },
                                { label: 'Career Resources', href: '/resources' },
                                { label: 'About Us', href: '/about' },
                            ].map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className="hover:text-primary transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Compliance & Contact */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Compliance Standards</h4>
                        <p className="text-sm text-muted-foreground">
                            All documents structured to FDA 21 CFR, ICH Q7/Q10, WHO GMP, EU GMP, and USP requirements.
                        </p>
                        <div className="flex flex-col gap-1.5 text-sm pt-1">
                            <a href="/about#contact" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                                <Mail className="h-4 w-4" /> contact@sarkpharmatech.com
                            </a>
                            <a href="tel:+918237750691" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                                <Phone className="h-4 w-4" /> +91 8237750691
                            </a>
                            <a href="https://wa.me/918237750691" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors">
                                <MessageCircle className="h-4 w-4" /> WhatsApp Us
                            </a>
                            <div className="flex items-start gap-2 text-muted-foreground mt-1">
                                <Globe className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>Maharashtra, India</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                    <p>© {year} Sark Pharma Tech Services. All rights reserved.</p>
                    <div className="flex gap-4 flex-wrap justify-center sm:justify-end">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
                        <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
                        <Link href="/refund" className="hover:text-primary transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
