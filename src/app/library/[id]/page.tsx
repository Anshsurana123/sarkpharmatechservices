'use client';

import { use } from 'react';
import { usePharmaStore } from '@/data/store';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, User, Building2, ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export default function LibraryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const sops = usePharmaStore(state => state.sops);
    const isInitialized = usePharmaStore(state => state.isInitialized);

    if (!isInitialized) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading document...</div>;
    }

    const sop = sops.find(s => s.id === resolvedParams.id);
    if (!sop) notFound();

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <Breadcrumbs crumbs={[
                { label: 'SOP Library', href: '/library' },
                { label: sop.title },
            ]} />
            {/* Back nav */}
            <Button variant="ghost" size="sm" asChild className="-ml-2 gap-2">
                <Link href="/library">
                    <ArrowLeft className="h-4 w-4" /> Back to Library
                </Link>
            </Button>

            {/* Header */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-background">{sop.documentType}</Badge>
                    <Badge variant="outline" className="bg-background">{sop.department}</Badge>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{sop.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" />{sop.id}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Updated {sop.date}</span>
                    <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{sop.author}</span>
                    <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" />{sop.department}</span>
                </div>
            </div>

            {/* Content */}
            <Card>
                <CardHeader className="border-b bg-muted/10 flex flex-row items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Document Content</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {sop.content ? (
                        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                            {sop.content}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted-foreground flex flex-col items-center gap-3">
                            <FileText className="h-10 w-10 opacity-20" />
                            <p className="font-medium">No text content available</p>
                            <p className="text-sm">This document has no written content to preview. Visit the SOP Database to purchase the full document.</p>
                            <Button variant="outline" size="sm" asChild className="mt-2">
                                <Link href="/sops">Go to SOP Database</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
