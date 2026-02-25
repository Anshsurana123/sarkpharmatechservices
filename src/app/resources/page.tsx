import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, FileText, Calculator, MessageSquare, ArrowRight } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";

export const metadata: Metadata = {
    title: 'Career Resources | Sark Pharma Tech Services',
    description: 'Free tools for pharma professionals including resume builders and salary calculators.',
};

export default function ResourcesPage() {
    return (
        <div className="max-w-6xl mx-auto pt-6 pb-16 space-y-12">
            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-center shadow-xl">
                <Image src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&q=80" alt="Career Resources" fill className="object-cover z-0" priority />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/95 via-[#0d6e66]/85 to-[#0f2744]/70 z-[1]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] z-[1]" />
                <div className="relative z-10 text-white space-y-4">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 mx-auto mb-2">
                        <Wrench className="h-8 w-8 text-teal-300" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Pharma Career Tools</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                        A suite of free utilities designed to help quality assurance and regulatory professionals advance their careers.
                    </p>
                </div>
            </section>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Resume Builder */}
                <Card className="flex flex-col border shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                    <div className="h-40 bg-muted flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors z-0" />
                        <FileText className="h-16 w-16 text-primary/40 z-10" />
                        <Badge className="absolute top-4 right-4 bg-background/80 text-foreground backdrop-blur border">Beta</Badge>
                    </div>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            QA/QC Resume Builder
                        </CardTitle>
                        <CardDescription>
                            Create ATS-friendly resumes tailored for pharmaceutical quality roles. Include standard GMP action verbs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 pb-6">
                        <Button variant="outline" className="w-full mt-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                            <Link href="/resources/resume-builder">
                                Launch Builder <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Salary Calculator */}
                <Card className="flex flex-col border shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                    <div className="h-40 bg-muted flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-secondary/10 group-hover:bg-secondary/20 transition-colors z-0" />
                        <Calculator className="h-16 w-16 text-secondary/40 z-10" />
                        <Badge className="absolute top-4 right-4 bg-background/80 text-foreground backdrop-blur border">New</Badge>
                    </div>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl group-hover:text-secondary transition-colors">
                            Industry Salary Guide
                        </CardTitle>
                        <CardDescription>
                            Compare your compensation against industry benchmarks based on department, experience, and location.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 pb-6">
                        <Button variant="outline" className="w-full mt-auto group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors" asChild>
                            <Link href="/resources/salary-calculator">
                                Access Calculator
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Interview Q&A */}
                <Card className="flex flex-col border shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                    <div className="h-40 bg-muted flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors z-0" />
                        <MessageSquare className="h-16 w-16 text-blue-500/40 z-10" />
                        <Badge variant="secondary" className="absolute top-4 right-4 bg-blue-500 text-white border-transparent">Hot</Badge>
                    </div>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl group-hover:text-blue-500 transition-colors">
                            GMP Interview Q&amp;A
                        </CardTitle>
                        <CardDescription>
                            A curated database of the most common technical questions asked during QA/QC and Regulatory job interviews.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 pb-6">
                        <Button variant="outline" className="w-full mt-auto group-hover:border-blue-500 group-hover:text-blue-600 transition-colors" asChild>
                            <Link href="/insights?cat=Career">View Questions</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center pt-8 border-t">
                <p className="text-sm text-muted-foreground">More tools are currently in development. Subscribe to our newsletter to be notified of new releases.</p>
            </div>
        </div>
    );
}
