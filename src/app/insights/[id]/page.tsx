'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import type { Insight } from '@/data/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Download, FileText, Loader2, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export default function InsightDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [insight, setInsight] = useState<Insight | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchInsight() {
            const { data, error } = await supabase
                .from('insights')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                setNotFound(true);
            } else {
                setInsight(data as Insight);
            }
            setLoading(false);
        }
        if (id) fetchInsight();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (notFound || !insight) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
                <FileText className="h-16 w-16 text-muted-foreground/40" />
                <h2 className="text-2xl font-bold">Insight Not Found</h2>
                <p className="text-muted-foreground">This insight may have been removed.</p>
                <Button asChild variant="outline">
                    <Link href="/">← Back to Home</Link>
                </Button>
            </div>
        );
    }

    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Breadcrumbs + back nav */}
            <div className="flex items-center justify-between gap-4">
                <Breadcrumbs crumbs={[
                    { label: 'Insights', href: '/' },
                    { label: insight.title },
                ]} />
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 shrink-0">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
            </div>

            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary dark:bg-primary/10 dark:text-primary">
                            {insight.category}
                        </Badge>
                        <span className="flex items-center text-sm text-muted-foreground gap-1">
                            <Clock className="h-4 w-4" />
                            {insight.read_time}
                        </span>
                        <span className="text-sm text-muted-foreground">{insight.date}</span>
                    </div>
                    {/* LinkedIn share */}
                    <a
                        href={linkedInShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0077B5]/10 text-[#0077B5] dark:bg-[#0077B5]/20 hover:bg-[#0077B5]/20 dark:hover:bg-[#0077B5]/30 transition-colors text-sm font-medium"
                    >
                        <Linkedin className="h-4 w-4" /> Share on LinkedIn
                    </a>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                    {insight.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {insight.excerpt}
                </p>
            </div>

            {/* Document Viewer or No-file state */}
            {insight.file_url ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Document</h2>
                        <Button asChild variant="outline" size="sm" className="gap-2">
                            <a href={insight.file_url} download target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4" />
                                Download (.docx)
                            </a>
                        </Button>
                    </div>
                    {/* Google Docs Viewer embeds .docx files in-browser */}
                    <div className="rounded-2xl border overflow-hidden shadow-sm bg-card">
                        <iframe
                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(insight.file_url)}&embedded=true`}
                            className="w-full"
                            style={{ height: '75vh', minHeight: '500px' }}
                            title={insight.title}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 rounded-2xl border bg-muted/20 gap-3 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/40" />
                    <p className="text-muted-foreground">No document was attached to this insight.</p>
                </div>
            )}
        </div>
    );
}
