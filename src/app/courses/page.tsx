'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Clock, CheckCircle2, ShoppingCart, DownloadCloud, PlayCircle, File as FileIcon } from "lucide-react";
import Link from "next/link";
import { usePharmaStore, Course } from '@/data/store';
import { useRazorpay } from '@/hooks/useRazorpay';

export default function CoursesPage() {
    const courses = usePharmaStore(state => state.courses);
    const initialize = usePharmaStore(state => state.initialize);
    const isInitialized = usePharmaStore(state => state.isInitialized);
    const { processPayment, isProcessing } = useRazorpay();
    const [purchasedCourseIds, setPurchasedCourseIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        initialize();

        const loadPurchases = () => {
            try {
                const purchases = JSON.parse(localStorage.getItem('pharma_purchases') || '[]');
                const ids = new Set(purchases.map((p: any) => p.id));
                setPurchasedCourseIds(ids as Set<string>);
            } catch (e) { }
        };

        loadPurchases();

        window.addEventListener('pharma_purchase_complete', loadPurchases);
        return () => window.removeEventListener('pharma_purchase_complete', loadPurchases);
    }, [initialize]);

    const handleBuy = (course: Course) => {
        processPayment(course.price, 'USD', `Purchase Course: ${course.title}`, course.id, course.title);
    };

    return (
        <div className="max-w-6xl mx-auto pb-16 space-y-12">
            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-center shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary to-secondary/90 z-0" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] z-0" />
                <div className="relative z-10 text-primary-foreground space-y-4">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/15 backdrop-blur border border-white/20 mx-auto mb-2">
                        <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mx-auto mb-4 block w-max">Enroll Now</Badge>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Pharmaceutical Training &amp; Courses</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                        Master the complex world of GMP compliance, Quality Assurance, and Regulatory Affairs with expert-led online certification programs.
                    </p>
                </div>
            </section>

            {/* Course Offerings - Dynamic */}
            <section className="space-y-6">
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Our Certification Programs</h2>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Comprehensive training modules designed for industry professionals, from entry-level QA officers to experienced facility managers.
                    </p>
                </div>

                {!isInitialized ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading courses...</p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Check back soon for new course offerings!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course, index) => {
                            // Assign a theme color based on index for variety
                            const colors = [
                                { bg: 'bg-primary', light: 'bg-primary/10', hover: 'group-hover:bg-primary/20', text: 'text-primary' },
                                { bg: 'bg-secondary', light: 'bg-secondary/10', hover: 'group-hover:bg-secondary/20', text: 'text-secondary' },
                                { bg: 'bg-blue-500', light: 'bg-blue-500/10', hover: 'group-hover:bg-blue-500/20', text: 'text-blue-500' },
                            ];
                            const theme = colors[index % colors.length];

                            return (
                                <Card key={course.id} className="flex flex-col border shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                                    <div className="h-40 bg-muted flex flex-col items-center justify-center relative overflow-hidden">
                                        {course.image_url ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={course.image_url} alt={course.title} className="w-full h-full object-cover z-0" />
                                        ) : (
                                            <>
                                                <div className={`absolute inset-0 ${theme.light} ${theme.hover} transition-colors z-0`} />
                                                <CheckCircle2 className={`h-16 w-16 ${theme.text} opacity-40 z-10`} />
                                            </>
                                        )}
                                        <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur text-foreground border shadow-sm">${course.price}</Badge>
                                    </div>
                                    <CardHeader className="pb-3">
                                        <div className="flex gap-2 mb-2">
                                            <Badge variant="secondary">{course.level}</Badge>
                                        </div>
                                        <CardTitle className={`text-lg leading-tight group-hover:${theme.text} transition-colors`}>
                                            {course.title}
                                        </CardTitle>
                                        <CardDescription className="text-xs flex items-center gap-4 mt-2">
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                                            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.modules.length} Modules</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col flex-1 pb-4">
                                        <p className="text-sm text-foreground/80 mb-4 line-clamp-3">
                                            {course.description}
                                        </p>
                                        <div className="mt-auto space-y-2">
                                            <p className="text-xs font-semibold text-muted-foreground">Key Modules:</p>
                                            <ul className="text-xs text-muted-foreground space-y-1">
                                                {course.modules.slice(0, 3).map((mod, i) => (
                                                    <li key={i} className="flex items-start gap-1">
                                                        <span className={`${theme.text}`}>•</span> {mod}
                                                    </li>
                                                ))}
                                                {course.modules.length > 3 && (
                                                    <li className="text-xs italic">+{course.modules.length - 3} more...</li>
                                                )}
                                            </ul>
                                        </div>
                                    </CardContent>

                                    {purchasedCourseIds.has(course.id) ? (
                                        <div className="p-4 mx-4 mb-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900">
                                            <h4 className="font-semibold text-green-700 dark:text-green-500 mb-2 flex items-center text-sm"><CheckCircle2 className="h-4 w-4 mr-2" /> Course Purchased</h4>
                                            {course.files && course.files.length > 0 ? (
                                                <div className="space-y-2">
                                                    {course.files.map((file, i) => (
                                                        <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 text-xs bg-background border rounded hover:bg-muted transition-colors">
                                                            <span className="flex items-center gap-2 truncate">
                                                                {file.type.includes('video') ? <PlayCircle className="h-3 w-3 text-blue-500 shrink-0" /> : <FileIcon className="h-3 w-3 text-muted-foreground shrink-0" />}
                                                                <span className="truncate">{file.name}</span>
                                                            </span>
                                                            <DownloadCloud className="h-3 w-3 text-primary shrink-0 ml-2" />
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-green-600/80">No downloadable materials for this course yet.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <CardFooter className="pt-2">
                                            <Button
                                                className={`w-full ${theme.bg} text-white hover:opacity-90 transition-opacity`}
                                                onClick={() => handleBuy(course)}
                                                disabled={isProcessing}
                                            >
                                                <ShoppingCart className="mr-2 h-4 w-4" /> Enroll for ${course.price}
                                            </Button>
                                        </CardFooter>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Corporate Training Block */}
            <section className="rounded-2xl border bg-card p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                <div className="h-24 w-24 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">Corporate Training Workshops</h3>
                    <p className="text-muted-foreground mb-4">
                        Need offline workshops or bespoke training for your entire quality team? Our experts travel globally to conduct in-house compliance and audit-readiness seminars.
                    </p>
                    <Button variant="outline" asChild>
                        <Link href="/about#contact">
                            Contact for Enterprise Pricing
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
