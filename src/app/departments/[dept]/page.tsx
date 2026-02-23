'use client';

import { use } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default function DepartmentPage({ params }: { params: Promise<{ dept: string }> }) {
    const resolvedParams = use(params);
    const { processPayment, isProcessing } = useRazorpay();

    const sops = usePharmaStore(state => state.sops);
    const departments = usePharmaStore(state => state.departments);
    const isInitialized = usePharmaStore(state => state.isInitialized);

    if (!isInitialized) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading department data...</div>;
    }

    // Find the department by URL id
    const department = departments.find(d => d.id === resolvedParams.dept);
    const fullDeptName = department?.title;

    // If the department doesn't exist in our mapping, return a 404
    if (!fullDeptName) {
        notFound();
    }

    const departmentSops = sops.filter(sop => sop.department === fullDeptName);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{fullDeptName} Documents</h1>
                    <p className="text-muted-foreground">View all controlled documents for this department.</p>
                </div>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b flex items-center justify-between bg-muted/10">
                    <div className="font-medium">Available Documents</div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {departmentSops.length} results
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="w-[120px]">Doc ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departmentSops.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                                        No documents found for this department.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                departmentSops.map((sop) => (
                                    <TableRow key={sop.id} className="hover:bg-muted/10">
                                        <TableCell className="font-medium text-primary">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                {sop.id}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/sops/${sop.id}`} className="group flex items-center gap-2">
                                                <span className="font-semibold text-foreground/90 group-hover:text-primary transition-colors">{sop.title}</span>
                                                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                            <div className="text-xs text-muted-foreground mt-1">Updated {sop.date} • {sop.author}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-background">
                                                {sop.documentType}
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
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
