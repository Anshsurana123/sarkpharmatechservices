'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePharmaStore } from '@/data/store';
import { ArticleCard } from '@/components/shared/ArticleCard';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function InsightsContent() {
    const searchParams = useSearchParams();
    const insights = usePharmaStore(state => state.insights);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Initialise category from URL if present
    useEffect(() => {
        const cat = searchParams.get('cat');
        if (cat) setSelectedCategory(cat);
    }, [searchParams]);

    // Extract unique categories from insights
    const categories = Array.from(new Set(insights.map(i => i.category))).sort();

    const filteredInsights = selectedCategory
        ? insights.filter(i => i.category === selectedCategory)
        : insights;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Header */}
            <section className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-center shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/80 z-0" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] z-0" />
                <div className="relative z-10 text-primary-foreground space-y-4">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/15 backdrop-blur border border-white/20 mx-auto mb-2">
                        <BookOpen className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Regulatory Insights</h1>
                    <p className="text-lg text-white/75 max-w-2xl mx-auto">
                        Curated articles and expert commentary on FDA, EMA, WHO, and ICH guidelines to keep your team informed.
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            {categories.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                    <Badge
                        variant={selectedCategory === null ? "default" : "secondary"}
                        className="cursor-pointer px-4 py-1.5 text-sm transition-colors"
                        onClick={() => setSelectedCategory(null)}
                    >
                        All
                    </Badge>
                    {categories.map(cat => (
                        <Badge
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "secondary"}
                            className="cursor-pointer px-4 py-1.5 text-sm transition-colors border-muted-foreground/20 hover:bg-muted"
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </Badge>
                    ))}
                </div>
            )}

            {/* Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInsights.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        No articles found for the selected category.
                    </div>
                ) : (
                    filteredInsights.map(insight => (
                        <ArticleCard
                            key={insight.id}
                            id={insight.id}
                            title={insight.title}
                            excerpt={insight.excerpt}
                            date={insight.date}
                            category={insight.category}
                            readTime={insight.read_time}
                            file_url={insight.file_url}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default function InsightsPage() {
    return (
        <Suspense fallback={<div className="py-20 text-center text-muted-foreground animate-pulse">Loading insights...</div>}>
            <InsightsContent />
        </Suspense>
    );
}
