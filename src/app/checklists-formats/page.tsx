'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { usePharmaStore } from '@/data/store';
import { useRazorpay } from '@/hooks/useRazorpay';
import { SOPTableSkeleton } from '@/components/shared/Skeletons';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Search, ShoppingCart } from 'lucide-react';

function ChecklistsDashboardContent() {
    const { processPayment, isProcessing } = useRazorpay();
    const searchParams = useSearchParams();
    const checklists = usePharmaStore(state => state.checklists_formats);
    const departments = usePharmaStore(state => state.departments);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepts, setSelectedDepts] = useState<string[]>([]);

    useEffect(() => {
        const deptParam = searchParams.get('dept');
        if (deptParam) {
            const deptMapping: Record<string, string> = {
                qa: 'Quality Assurance',
                qc: 'Quality Control',
                micro: 'Microbiology'
            };
            const fullDeptName = deptMapping[deptParam];
            if (fullDeptName) {
                setSelectedDepts([fullDeptName]);
            }
        }
    }, [searchParams]);

    const toggleFilter = (list: string[], setList: (v: string[]) => void, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const filteredChecklists = checklists.filter(checklist => {
        const matchesSearch = checklist.title.toLowerCase().includes(searchQuery.toLowerCase()) || checklist.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(checklist.department);
        return matchesSearch && matchesDept;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Checklists & Formats</h1>
                    <p className="text-muted-foreground">Search, filter, and access all checklists and formats.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Faceted Sidebar */}
                <div className="w-full lg:w-64 shrink-0 space-y-6">
                    <div className="bg-card border rounded-xl p-5 shadow-sm">
                        <h3 className="font-semibold mb-3">Department</h3>
                        <div className="space-y-2">
                            {departments.map(deptObj => {
                                const dept = deptObj.title;
                                return (
                                    <div key={dept} className="flex items-center space-x-2">
                                        <button
                                            onClick={() => toggleFilter(selectedDepts, setSelectedDepts, dept)}
                                            className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${selectedDepts.includes(dept) ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-transparent'}`}
                                        >
                                            {selectedDepts.includes(dept) && <span className="text-[10px]">✓</span>}
                                        </button>
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {dept}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Data Table Area */}
                <div className="flex-1 bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b flex items-center gap-4 bg-muted/10">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by ID or Title..."
                                className="pl-8 bg-background"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                            {filteredChecklists.length} results
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="w-[120px]">Doc ID</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredChecklists.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                                            No documents found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredChecklists.map((checklist) => (
                                        <TableRow key={checklist.id} className="hover:bg-muted/10">
                                            <TableCell className="font-medium text-primary">
                                                <div className="flex items-center gap-2">
                                                    <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                                                    {checklist.id}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/checklists-formats/${checklist.id}`} className="font-semibold text-primary hover:underline">{checklist.title}</Link>
                                                <div className="text-xs text-muted-foreground mt-1">Updated {checklist.date} • {checklist.author}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-background">
                                                    {checklist.department}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-primary hover:bg-primary/90"
                                                    onClick={() => processPayment(checklist.price || 499, 'INR', `License for ${checklist.title}`)}
                                                    disabled={isProcessing}
                                                >
                                                    <ShoppingCart className="h-4 w-4 mr-2" /> {isProcessing ? 'Processing' : `Buy Checklist/Format - ₹${checklist.price || 499}`}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ChecklistsDashboard() {
    return (
        <Suspense fallback={<SOPTableSkeleton />}>
            <ChecklistsDashboardContent />
        </Suspense>
    );
}
