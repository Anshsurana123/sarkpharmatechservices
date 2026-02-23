'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePharmaStore } from '@/data/store';
import { useRazorpay } from '@/hooks/useRazorpay';
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
import { FileText, Search, ShoppingCart } from 'lucide-react';

const DOC_TYPES = ['Manual', 'Protocol', 'Checklist'];

function SOPDashboardContent() {
    const { processPayment, isProcessing } = useRazorpay();
    const searchParams = useSearchParams();
    const sops = usePharmaStore(state => state.sops);
    const departments = usePharmaStore(state => state.departments);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    useEffect(() => {
        const deptParam = searchParams.get('dept');
        if (deptParam) {
            // Map the URL shorthand to the full department name
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

    const filteredSops = sops.filter(sop => {
        const matchesSearch = sop.title.toLowerCase().includes(searchQuery.toLowerCase()) || sop.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(sop.department);
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(sop.documentType);
        return matchesSearch && matchesDept && matchesType;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">MS Word Editable SOP Database</h1>
                    <p className="text-muted-foreground">Search, filter, and access all controlled documents.</p>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSdP0PdUGnuxn3iOigqZ1f02eu1Bkqn7YAFGtqnbnbqwB0D8fg/viewform?usp=publish-editor" target="_blank" rel="noopener noreferrer">
                        Request Document
                    </a>
                </Button>
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

                        <h3 className="font-semibold mt-6 mb-3">Document Type</h3>
                        <div className="space-y-2">
                            {DOC_TYPES.map(type => (
                                <div key={type} className="flex items-center space-x-2">
                                    <button
                                        onClick={() => toggleFilter(selectedTypes, setSelectedTypes, type)}
                                        className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${selectedTypes.includes(type) ? 'bg-secondary border-secondary text-secondary-foreground' : 'border-input bg-transparent'}`}
                                    >
                                        {selectedTypes.includes(type) && <span className="text-[10px]">✓</span>}
                                    </button>
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                            {filteredSops.length} results
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="w-[120px]">Doc ID</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSops.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                                            No documents found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSops.map((sop) => (
                                        <TableRow key={sop.id} className="hover:bg-muted/10">
                                            <TableCell className="font-medium text-primary">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    {sop.id}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-foreground/90">{sop.title}</span>
                                                <div className="text-xs text-muted-foreground mt-1">Updated {sop.date} • {sop.author}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-background">
                                                    {sop.department}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        sop.status === 'Approved' ? 'bg-secondary/10 text-secondary hover:bg-secondary/20' :
                                                            sop.status === 'Draft' ? 'bg-muted text-muted-foreground hover:bg-muted/80' :
                                                                'bg-primary/10 text-primary hover:bg-primary/20'
                                                    }
                                                >
                                                    {sop.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-primary hover:bg-primary/90"
                                                    onClick={() => processPayment(499, 'INR', `License for ${sop.title}`)}
                                                    disabled={isProcessing}
                                                >
                                                    <ShoppingCart className="h-4 w-4 mr-2" /> {isProcessing ? 'Processing' : 'Buy'}
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

export default function SOPDashboard() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>}>
            <SOPDashboardContent />
        </Suspense>
    );
}
