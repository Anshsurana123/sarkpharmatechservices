'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calculator, TrendingUp } from "lucide-react";
import Link from 'next/link';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const SALARY_DATA: Record<string, Record<string, { min: number, max: number, median: number }>> = {
    'Quality Assurance': {
        '0-2': { min: 3, max: 5, median: 4 },
        '3-5': { min: 5, max: 8, median: 6.5 },
        '5-10': { min: 8, max: 15, median: 11 },
        '10+': { min: 15, max: 25, median: 20 },
    },
    'Quality Control': {
        '0-2': { min: 2.5, max: 4, median: 3.2 },
        '3-5': { min: 4, max: 7, median: 5.5 },
        '5-10': { min: 7, max: 12, median: 9.5 },
        '10+': { min: 12, max: 20, median: 16 },
    },
    'Regulatory Affairs': {
        '0-2': { min: 4, max: 6, median: 5 },
        '3-5': { min: 6, max: 10, median: 8 },
        '5-10': { min: 10, max: 18, median: 14 },
        '10+': { min: 18, max: 30, median: 24 },
    },
    'Production / Manufacturing': {
        '0-2': { min: 2, max: 4, median: 3 },
        '3-5': { min: 4, max: 6, median: 5 },
        '5-10': { min: 6, max: 10, median: 8 },
        '10+': { min: 10, max: 18, median: 14 },
    }
};

export default function SalaryCalculatorPage() {
    const [department, setDepartment] = useState<string>('');
    const [experience, setExperience] = useState<string>('');
    const [result, setResult] = useState<{ min: number, max: number, median: number } | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);

    const handleCalculate = () => {
        if (!department || !experience) return;

        const data = SALARY_DATA[department][experience];
        setResult(data);

        // Prepare chart data showing progression for this department
        const progression = Object.keys(SALARY_DATA[department]).map(exp => ({
            experience: exp + ' Yrs',
            Median: SALARY_DATA[department][exp].median,
            Min: SALARY_DATA[department][exp].min,
            Max: SALARY_DATA[department][exp].max,
        }));
        setChartData(progression);
    };

    return (
        <div className="max-w-4xl mx-auto pb-16 space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/resources"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Industry Salary Guide</h1>
                    <p className="text-muted-foreground">Estimate compensation based on current Indian market trends.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Calculate Estimate</CardTitle>
                        <CardDescription>Enter your details to see the expected salary band in LPA (Lakhs Per Annum).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Department</label>
                            <Select value={department} onValueChange={setDepartment}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(SALARY_DATA).map(dept => (
                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Years of Experience</label>
                            <Select value={experience} onValueChange={setExperience}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Experience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0-2">0 - 2 Years (Entry)</SelectItem>
                                    <SelectItem value="3-5">3 - 5 Years (Mid)</SelectItem>
                                    <SelectItem value="5-10">5 - 10 Years (Senior)</SelectItem>
                                    <SelectItem value="10+">10+ Years (Lead / Manager)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleCalculate}
                            disabled={!department || !experience}
                        >
                            <Calculator className="mr-2 h-4 w-4" /> Calculate Salary
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-muted/50 border-none shadow-inner flex flex-col justify-center items-center text-center p-6">
                    {!result ? (
                        <div className="text-muted-foreground flex flex-col items-center gap-4">
                            <Calculator className="h-12 w-12 opacity-20" />
                            <p>Select your department and experience to view estimates.</p>
                        </div>
                    ) : (
                        <div className="space-y-6 w-full animate-in fade-in zoom-in duration-300">
                            <Badge variant="outline" className="bg-background">Estimated Range (LPA)</Badge>
                            <div className="space-y-2">
                                <h2 className="text-5xl font-extrabold text-primary">₹{result.min}L - ₹{result.max}L</h2>
                                <p className="text-muted-foreground font-medium">Median: ₹{result.median} Lakhs / year</p>
                            </div>
                            <div className="pt-6 border-t border-border/50 text-left text-sm text-muted-foreground space-y-2">
                                <p className="flex items-start gap-2">
                                    <TrendingUp className="h-4 w-4 mt-0.5 shrink-0 text-green-500" />
                                    <span>Top tier companies (MNCs, FDA-approved sites) often pay 15-20% above this median.</span>
                                </p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {chartData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Career Progression: {department}</CardTitle>
                        <CardDescription>Average salary growth across experience levels in Lakhs Per Annum (LPA).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ChartContainer config={{ Median: { color: "var(--primary)" } }} className="w-full h-full min-h-[300px]">
                                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                    <XAxis dataKey="experience" tickLine={false} axisLine={false} tickMargin={10} />
                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}L`} tickMargin={10} />
                                    <ChartTooltip cursor={{ fill: 'var(--muted)' }} content={<ChartTooltipContent />} />
                                    <Bar dataKey="Median" fill="var(--color-Median)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="text-center text-sm text-muted-foreground mt-8">
                <p>Disclaimer: These figures are estimates based on industry surveys in India. Actual salaries may vary significantly based on company size, location, and individual negotiation skills.</p>
            </div>
        </div>
    );
}
