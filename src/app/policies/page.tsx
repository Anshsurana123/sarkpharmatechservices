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
import { FileText, Search, ShoppingCart, Presentation } from 'lucide-react';

function PoliciesDashboardContent() {
    const { processPayment, isProcessing } = useRazorpay();
    const searchParams = useSearchParams();
    const policies = usePharmaStore(state => state.policies);
    const departments = usePharmaStore(state => state.departments);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
    const [selectedPolicyTypes, setSelectedPolicyTypes] = useState<string[]>([]);

    const policyTypesList = [
        'Quality policy',
        'SHE policy',
        'Validation policy',
        'Site Master file',
        'Pharmacovigilance system master file',
        'Quality Manual',
        'Validation master plan'
    ];

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

    const filteredPolicies = policies.filter(policy => {
        if (policy.documentType === 'Presentation') return false;
        const matchesSearch = policy.title.toLowerCase().includes(searchQuery.toLowerCase()) || policy.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(policy.department);
        const matchesType = selectedPolicyTypes.length === 0 || selectedPolicyTypes.includes(policy.documentType);
        return matchesSearch && matchesDept && matchesType;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Policies</h1>
                    <p className="text-muted-foreground">Search, filter, and access all company policies.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Faceted Sidebar */}
                <div className="w-full lg:w-64 shrink-0 space-y-6">
                    <div className="bg-card border rounded-xl p-5 shadow-sm">
                        <h3 className="font-semibold mb-3">Department</h3>
                        <div className="space-y-2 mb-6">
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

                        <h3 className="font-semibold mb-3 pt-4 border-t">Policy Type</h3>
                        <div className="space-y-2">
                            {policyTypesList.map(type => (
                                <div key={type} className="flex items-center space-x-2">
                                    <button
                                        onClick={() => toggleFilter(selectedPolicyTypes, setSelectedPolicyTypes, type)}
                                        className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${selectedPolicyTypes.includes(type) ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-transparent'}`}
                                    >
                                        {selectedPolicyTypes.includes(type) && <span className="text-[10px]">✓</span>}
                                    </button>
                                    <label className="text-sm font-medium leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {type}
                                    </label>
                                </div>
                            ))}
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
                            {filteredPolicies.length} results
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
                                {filteredPolicies.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                                            No policies found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPolicies.map((policy) => (
                                        <TableRow key={policy.id} className="hover:bg-muted/10">
                                            <TableCell className="font-medium text-primary">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    {policy.id}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/policies/${policy.id}`} className="font-semibold text-primary hover:underline">{policy.title}</Link>
                                                <div className="text-xs text-muted-foreground mt-1">Updated {policy.date} • {policy.author}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant="outline" className="bg-background w-fit">
                                                        {policy.department}
                                                    </Badge>
                                                    {policy.documentType && policy.documentType !== 'Policy' && (
                                                        <Badge variant="secondary" className="w-fit text-[10px]">
                                                            {policy.documentType}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-primary hover:bg-primary/90"
                                                    onClick={() => processPayment(policy.price || 499, 'INR', `License for ${policy.title}`)}
                                                    disabled={isProcessing}
                                                >
                                                    <ShoppingCart className="h-4 w-4 mr-2" /> {isProcessing ? 'Processing' : `Buy Policy - ₹${policy.price || 499}`}
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

export default function PoliciesDashboard() {
    return (
        <Suspense fallback={<SOPTableSkeleton />}>
            <PoliciesDashboardContent />
        </Suspense>
    );
}
