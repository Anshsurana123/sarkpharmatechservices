import { Skeleton } from "@/components/ui/skeleton";

export function SOPTableSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-72" />
                <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Filter sidebar */}
                <div className="w-full lg:w-64 shrink-0">
                    <div className="bg-card border rounded-xl p-5 space-y-4">
                        <Skeleton className="h-5 w-24" />
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
                        <Skeleton className="h-5 w-28 mt-4" />
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-4 w-full" />)}
                    </div>
                </div>
                {/* Table */}
                <div className="flex-1 bg-card border rounded-xl overflow-hidden">
                    <div className="p-4 border-b">
                        <Skeleton className="h-9 w-full rounded-full" />
                    </div>
                    <div className="p-4 space-y-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="flex items-center gap-4 py-1">
                                <Skeleton className="h-4 w-24 shrink-0" />
                                <Skeleton className="h-4 flex-1" />
                                <Skeleton className="h-6 w-28 rounded-full" />
                                <Skeleton className="h-8 w-16 rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CardGridSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-card border rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-4 w-14" />
                    </div>
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-2/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ))}
        </div>
    );
}

export function DetailPageSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <Skeleton className="h-8 w-24" />
            <div className="space-y-3">
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-28 rounded-full" />
                </div>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
            </div>
            <div className="bg-card border rounded-2xl p-6 space-y-4">
                <Skeleton className="h-6 w-40" />
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-4 w-full" />)}
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    );
}
