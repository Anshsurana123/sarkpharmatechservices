'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageOpen, ShieldCheck, CheckCircle2, ShoppingCart, Globe, FileText, ArrowRight } from "lucide-react";
import { useRazorpay } from '@/hooks/useRazorpay';
import Link from 'next/link';

export default function BundlesPage() {
    const { processPayment, isProcessing } = useRazorpay();

    const handleBuy = (amountInINR: number, title: string) => {
        processPayment(amountInINR, 'INR', `Purchase ${title}`);
    };

    return (
        <div className="max-w-6xl mx-auto pt-6 pb-16 space-y-12">
            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-center shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary to-secondary/90 z-0" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] z-0" />
                <div className="relative z-10 text-primary-foreground space-y-4">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/15 backdrop-blur border border-white/20 mx-auto mb-2">
                        <PackageOpen className="h-8 w-8 text-white" />
                    </div>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mx-auto mb-4 block w-max">Enterprise Solutions</Badge>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Ready-to-Download Packages</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                        Complete QMS and regulatory document bundles. Save time and money by purchasing comprehensive, audit-ready packages for your entire facility.
                    </p>
                </div>
            </section>

            {/* Packages Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Complete QMS */}
                <Card className="flex flex-col border-2 border-border shadow-sm hover:shadow-xl hover:border-primary/40 transition-all overflow-hidden relative group">
                    <div className="h-2 bg-primary w-full absolute top-0 left-0" />
                    <CardHeader className="pt-8 pb-4 text-center">
                        <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl mb-2">Complete QMS Package</CardTitle>
                        <CardDescription>Everything needed to build a Quality Management System from scratch.</CardDescription>
                        <div className="mt-4 flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-extrabold">₹49,999</span>
                            <span className="text-muted-foreground text-sm line-through">₹75,000</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        <ul className="space-y-3 text-sm text-foreground/80">
                            {[
                                "250+ Standard Operating Procedures",
                                "Quality Manual & Site Master File",
                                "All QA & QC Document Formats",
                                "Validation Master Plan template",
                                "CAPA & Change Control workflows",
                                "Internal Audit Checklists"
                            ].map(feature => (
                                <li key={feature} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter className="pb-8 pt-4">
                        <Button
                            className="w-full text-base py-6 rounded-xl font-bold shadow-md"
                            onClick={() => handleBuy(49999, 'Complete QMS Package')}
                            disabled={isProcessing}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" /> Buy QMS Package
                        </Button>
                    </CardFooter>
                </Card>

                {/* WHO-GMP Package */}
                <Card className="flex flex-col border-2 border-secondary shadow-lg relative overflow-hidden group scale-100 md:scale-105 z-10">
                    <div className="absolute top-4 right-[-30px] bg-secondary text-secondary-foreground text-xs font-bold px-10 py-1 rotate-45 shadow-sm">
                        Most Popular
                    </div>
                    <CardHeader className="pt-8 pb-4 text-center">
                        <div className="mx-auto h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Globe className="h-8 w-8 text-secondary" />
                        </div>
                        <CardTitle className="text-2xl mb-2">WHO-GMP Package</CardTitle>
                        <CardDescription>Tailored specifically for WHO Geneva pre-qualification audits.</CardDescription>
                        <div className="mt-4 flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-extrabold">₹65,999</span>
                            <span className="text-muted-foreground text-sm line-through">₹90,000</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        <ul className="space-y-3 text-sm text-foreground/80">
                            {[
                                "Complete QMS Package Base",
                                "WHO TRS 986 / 996 Aligned SOPs",
                                "HVAC & Water System Validation",
                                "Pharmacovigilance Master File",
                                "Product Quality Review (PQR) formats",
                                "Dedicated WHO audit checklists"
                            ].map(feature => (
                                <li key={feature} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter className="pb-8 pt-4">
                        <Button
                            className="w-full text-base py-6 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md"
                            onClick={() => handleBuy(65999, 'WHO-GMP Package')}
                            disabled={isProcessing}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" /> Buy WHO-GMP Block
                        </Button>
                    </CardFooter>
                </Card>

                {/* EU-GMP Package */}
                <Card className="flex flex-col border-2 border-border shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all overflow-hidden relative group">
                    <div className="h-2 bg-blue-500 w-full absolute top-0 left-0" />
                    <CardHeader className="pt-8 pb-4 text-center">
                        <div className="mx-auto h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FileText className="h-8 w-8 text-blue-500" />
                        </div>
                        <CardTitle className="text-2xl mb-2">EU-GMP Annex 1</CardTitle>
                        <CardDescription>Sterile manufacturing and advanced compliance documents.</CardDescription>
                        <div className="mt-4 flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-extrabold">₹85,999</span>
                            <span className="text-muted-foreground text-sm line-through">₹120,000</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        <ul className="space-y-3 text-sm text-foreground/80">
                            {[
                                "Complete QMS Package Base",
                                "Contamination Control Strategy (CCS)",
                                "Aseptic Process Simulation (Media Fill)",
                                "Environmental Monitoring Protocols",
                                "Cleanroom Garment Management",
                                "EU GMP Annex 1 2022 Updates"
                            ].map(feature => (
                                <li key={feature} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter className="pb-8 pt-4">
                        <Button
                            className="w-full text-base py-6 rounded-xl font-bold bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                            onClick={() => handleBuy(85999, 'EU-GMP Annex 1 Package')}
                            disabled={isProcessing}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" /> Buy EU-GMP Block
                        </Button>
                    </CardFooter>
                </Card>
            </section>

            {/* Custom Need Block */}
            <section className="rounded-2xl border bg-card p-10 flex flex-col items-center text-center shadow-sm max-w-4xl mx-auto">
                <Badge variant="outline" className="mb-4">Need specific documents?</Badge>
                <h3 className="text-2xl font-bold mb-3">Build Your Own Custom Bundle</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl">
                    Don&apos;t need an entire QMS package? Contact us to compile a custom bundle of 10, 25, or 50 specific SOPs and templates at a heavily discounted rate.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Button variant="default" size="lg" asChild>
                        <Link href="/about#contact">
                            Contact for Custom Pricing
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/sops" className="flex items-center gap-2">
                            Browse Individual SOPs <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
