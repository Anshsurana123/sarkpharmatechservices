'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SearchBar() {
    return (
        <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
                type="text"
                placeholder="Ask AI or search documents, courses..."
                className="pl-9 bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary rounded-full"
            />
        </div>
    );
}
