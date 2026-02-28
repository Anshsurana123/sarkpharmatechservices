'use client';

import { use, useEffect } from 'react';
import { usePharmaStore } from '@/data/store';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck, Calendar, User, Building2, ShoppingCart } from 'lucide-react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { CustomerReviews } from '@/components/shared/CustomerReviews';

export function ChecklistFormatDetailContent({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const checklists_formats = usePharmaStore(state => state.checklists_formats);
    const { processPayment, isProcessing } = useRazorpay();
    const isInitialized = usePharmaStore(state => state.isInitialized);

    const checklist = checklists_formats.find(p => p.id === resolvedParams.id);

    // Track recently viewed
    useEffect(() => {
        if (!checklist) return;
        try {
            const existing: { id: string; title: string; department: string; date: string; viewedAt: string }[] =
                JSON.parse(localStorage.getItem('pharma_recently_viewed_checklists') || '[]');
            const filtered = existing.filter(p => p.id !== checklist.id);
            const updated = [{ id: checklist.id, title: checklist.title, department: checklist.department, date: checklist.date, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 10);
            localStorage.setItem('pharma_recently_viewed_checklists', JSON.stringify(updated));
        } catch (_) { }
    }, [checklist?.id, checklist?.title, checklist?.department, checklist?.date]);

    if (!isInitialized) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading document data...</div>;
    }

    if (!checklist) {
        notFound();
    }

    const DocumentIcon = ClipboardCheck;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Breadcrumbs crumbs={[
                { label: 'Checklists & Formats', href: '/checklists-formats' },
                { label: checklist.title },
            ]} />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{checklist.title}</h1>
                    <p className="text-muted-foreground mt-1 text-sm flex items-center gap-4">
                        <span className="flex items-center gap-1"><DocumentIcon className="h-3 w-3" /> {checklist.id}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {checklist.date}</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {checklist.author}</span>
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        variant="default"
                        className="flex-1 md:flex-none bg-primary hover:bg-primary/90"
                        onClick={() => processPayment(checklist.price || 499, 'INR', `License for ${checklist.title}`)}
                        disabled={isProcessing}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" /> {isProcessing ? 'Processing' : `Buy Checklist/Format - ₹${checklist.price || 499}`}
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
                            {checklist.content ? (
                                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none whitespace-pre-wrap">
                                    {checklist.content}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground bg-muted/5 rounded-lg border border-dashed">
                                    <DocumentIcon className="h-8 w-8 mx-auto mb-3 opacity-20" />
                                    <p>No preview content available for this document.</p>
                                    <p className="text-sm mt-1">Please download the source file to view the full document.</p>
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
                                    {checklist.department}
                                </div>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Document ID</span>
                                <div className="font-medium">{checklist.id}</div>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Last Updated</span>
                                <div className="font-medium">{checklist.date}</div>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Author / Owner</span>
                                <div className="font-medium">{checklist.author}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Customer Reviews Section */}
            <CustomerReviews sopId={checklist.id} />
        </div>
    );
}
