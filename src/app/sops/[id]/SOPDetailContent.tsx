'use client';

import { use, useEffect } from 'react';
import { usePharmaStore } from '@/data/store';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Calendar, User, Building2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRazorpay } from '@/hooks/useRazorpay';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { CustomerReviews } from '@/components/shared/CustomerReviews';

export function SOPDetailContent({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const sops = usePharmaStore(state => state.sops);
    const { processPayment, isProcessing } = useRazorpay();
    const isInitialized = usePharmaStore(state => state.isInitialized);

    const sop = sops.find(s => s.id === resolvedParams.id);

    // Track recently viewed
    useEffect(() => {
        if (!sop) return;
        try {
            const existing: { id: string; title: string; department: string; date: string; viewedAt: string }[] =
                JSON.parse(localStorage.getItem('pharma_recently_viewed') || '[]');
            const filtered = existing.filter(s => s.id !== sop.id);
            const updated = [{ id: sop.id, title: sop.title, department: sop.department, date: sop.date, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 10);
            localStorage.setItem('pharma_recently_viewed', JSON.stringify(updated));
        } catch (_) { }
    }, [sop?.id, sop?.title, sop?.department, sop?.date]);

    if (!isInitialized) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading document data...</div>;
    }

    if (!sop) {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Breadcrumbs crumbs={[
                { label: 'SOP Database', href: '/sops' },
                { label: sop.title },
            ]} />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-background">{sop.documentType}</Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{sop.title}</h1>
                    <p className="text-muted-foreground mt-1 text-sm flex items-center gap-4">
                        <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {sop.id}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {sop.date}</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {sop.author}</span>
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        variant="default"
                        className="flex-1 md:flex-none bg-primary hover:bg-primary/90"
                        onClick={() => processPayment(sop.price || 499, 'INR', `License for ${sop.title}`)}
                        disabled={isProcessing}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" /> {isProcessing ? 'Processing' : `Buy License - ₹${sop.price || 499}`}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="bg-muted/10 border-b">
                            <CardTitle>Document Content</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {sop.content ? (
                                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none whitespace-pre-wrap">
                                    {sop.content}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground bg-muted/5 rounded-lg border border-dashed">
                                    <FileText className="h-8 w-8 mx-auto mb-3 opacity-20" />
                                    <p>No preview content available for this document.</p>
                                    <p className="text-sm mt-1">Please download the DOCX file to view the full standard operating procedure.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <span className="text-muted-foreground block mb-1">Department</span>
                                <div className="flex items-center gap-2 font-medium">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    {sop.department}
                                </div>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Document ID</span>
                                <div className="font-medium">{sop.id}</div>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Last Updated</span>
                                <div className="font-medium">{sop.date}</div>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Author / Owner</span>
                                <div className="font-medium">{sop.author}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Customer Reviews Section */}
            <CustomerReviews sopId={sop.id} />
        </div>
    );
}
