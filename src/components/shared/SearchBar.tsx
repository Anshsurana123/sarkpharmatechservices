'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, FileText, BookOpen, Lightbulb, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePharmaStore } from '@/data/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Result = {
    type: 'sop' | 'insight';
    id: string;
    title: string;
    subtitle: string;
    href: string;
};

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const sops = usePharmaStore(state => state.sops);
    const insights = usePharmaStore(state => state.insights);

    /* ── Close on outside click ─────────────────────── */
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    /* ── Keyboard shortcut: Ctrl+K / Cmd+K ─────────── */
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setOpen(true);
            }
            if (e.key === 'Escape') setOpen(false);
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    /* ── Filter results ─────────────────────────────── */
    const results: Result[] = query.trim().length < 2 ? [] : [
        ...sops
            .filter(s =>
                s.title.toLowerCase().includes(query.toLowerCase()) ||
                s.id.toLowerCase().includes(query.toLowerCase()) ||
                s.department.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5)
            .map(s => ({
                type: 'sop' as const,
                id: s.id,
                title: s.title,
                subtitle: `${s.id} · ${s.department}`,
                href: `/sops/${s.id}`,
            })),
        ...insights
            .filter(i =>
                i.title.toLowerCase().includes(query.toLowerCase()) ||
                i.category.toLowerCase().includes(query.toLowerCase()) ||
                i.excerpt.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 3)
            .map(i => ({
                type: 'insight' as const,
                id: i.id,
                title: i.title,
                subtitle: `Insight · ${i.category}`,
                href: `/insights/${i.id}`,
            })),
    ];

    const handleSelect = useCallback((href: string) => {
        setQuery('');
        setOpen(false);
        router.push(href);
    }, [router]);

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            {/* Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    placeholder="Search SOPs, insights… (Ctrl+K)"
                    className="pl-9 pr-9 bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary rounded-full"
                    onChange={e => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                />
                {query && (
                    <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {open && query.trim().length >= 2 && (
                <div className="absolute top-full mt-2 w-full left-0 z-50 rounded-2xl border bg-card shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {results.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                            No results for <span className="font-medium text-foreground">"{query}"</span>
                        </div>
                    ) : (
                        <ul className="max-h-80 overflow-y-auto divide-y divide-border/50">
                            {results.map(result => (
                                <li key={`${result.type}-${result.id}`}>
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors group"
                                        onClick={() => handleSelect(result.href)}
                                    >
                                        <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center ${result.type === 'sop' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 dark:bg-primary/10 text-secondary dark:text-primary'}`}>
                                            {result.type === 'sop'
                                                ? <FileText className="h-4 w-4" />
                                                : <Lightbulb className="h-4 w-4" />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{result.title}</p>
                                            <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                                        </div>
                                        <BookOpen className="h-4 w-4 text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="px-4 py-2 border-t bg-muted/20 text-xs text-muted-foreground flex gap-4">
                        <span><kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">↵</kbd> to open</span>
                        <span><kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Esc</kbd> to close</span>
                        <span><kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Ctrl K</kbd> to focus</span>
                    </div>
                </div>
            )}
        </div>
    );
}
