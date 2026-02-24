'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePharmaStore } from '@/data/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ShoppingBag, Clock, User as UserIcon, Building2, Calendar, ShieldCheck, ExternalLink } from 'lucide-react';

type Purchase = {
    id: string;
    title: string;
    amount: number;
    currency: string;
    paymentId: string;
    date: string;
};

type RecentView = {
    id: string;
    title: string;
    department: string;
    date: string;
    viewedAt: string;
};

export default function ProfilePage() {
    const session = usePharmaStore(state => state.session);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [recentViews, setRecentViews] = useState<RecentView[]>([]);

    useEffect(() => {
        try {
            setPurchases(JSON.parse(localStorage.getItem('pharma_purchases') || '[]'));
            setRecentViews(JSON.parse(localStorage.getItem('pharma_recently_viewed') || '[]'));
        } catch (_) { }
    }, []);

    const user = session?.user;

    return (
        <div className="max-w-4xl mx-auto pb-12 space-y-8">

            {/* Profile header */}
            <section className="relative rounded-3xl overflow-hidden p-8 md:p-10 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/80 z-0" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] z-0" />
                <div className="relative z-10 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur border border-white/25 flex items-center justify-center shrink-0">
                        {user?.user_metadata?.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-16 w-16 rounded-2xl object-cover" />
                        ) : (
                            <UserIcon className="h-8 w-8 text-white" />
                        )}
                    </div>
                    <div className="text-primary-foreground">
                        <h1 className="text-2xl font-extrabold tracking-tight">
                            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest User'}
                        </h1>
                        <p className="text-white/70 text-sm mt-0.5">{user?.email || 'Not signed in'}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <ShieldCheck className="h-4 w-4 text-white/60" />
                            <span className="text-xs text-white/60">Sark Pharma Tech Member</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Purchases', value: purchases.length, icon: ShoppingBag },
                    { label: 'Recently Viewed', value: recentViews.length, icon: Clock },
                    { label: 'Total Spent', value: purchases.length > 0 ? `₹${purchases.reduce((s, p) => s + p.amount, 0)}` : '₹0', icon: FileText },
                ].map(({ label, value, icon: Icon }) => (
                    <Card key={label} className="border shadow-sm">
                        <CardContent className="pt-5 flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                <Icon className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{value}</p>
                                <p className="text-xs text-muted-foreground">{label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Purchases */}
            <section className="rounded-2xl border bg-card overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b px-6 py-4 flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <div>
                        <h2 className="font-bold text-lg">Your Purchases</h2>
                        <p className="text-muted-foreground text-xs">SOP licences you have purchased</p>
                    </div>
                </div>
                <div className="p-6">
                    {purchases.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground/25" />
                            <p className="font-medium text-muted-foreground">No purchases made yet</p>
                            <p className="text-sm text-muted-foreground/70">Browse the SOP Database to purchase licensed documents.</p>
                            <Button asChild variant="outline" size="sm" className="mt-2">
                                <Link href="/sops">Browse SOPs</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {purchases.map((p) => (
                                <div key={p.paymentId} className="flex items-center justify-between p-4 rounded-xl border bg-muted/20 gap-4">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate">{p.title}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{p.date}</span>
                                            <span className="font-mono opacity-60">ID: {p.paymentId}</span>
                                        </div>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-0 font-semibold">
                                            ₹{p.amount}
                                        </Badge>
                                        <Link href={`/sops/${p.id}`} className="flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                                            View <ExternalLink className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Recently Viewed */}
            <section className="rounded-2xl border bg-card overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b px-6 py-4 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                        <h2 className="font-bold text-lg">Recently Viewed</h2>
                        <p className="text-muted-foreground text-xs">SOPs you have browsed recently</p>
                    </div>
                </div>
                <div className="p-6">
                    {recentViews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground/25" />
                            <p className="font-medium text-muted-foreground">No recently viewed SOPs</p>
                            <p className="text-sm text-muted-foreground/70">Start browsing to see your history here.</p>
                            <Button asChild variant="outline" size="sm" className="mt-2">
                                <Link href="/sops">Browse SOPs</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentViews.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`/sops/${s.id}`}
                                    className="flex items-center justify-between p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors group gap-4"
                                >
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{s.title}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                                            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{s.department}</span>
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{s.date}</span>
                                        </div>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
