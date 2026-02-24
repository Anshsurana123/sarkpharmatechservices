'use client';

import { useState, useEffect } from 'react';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { SearchBar } from '@/components/shared/SearchBar';
import { Bell, User, Sun, Moon, Package, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePharmaStore } from '@/data/store';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export function Topbar() {
    const session = usePharmaStore(state => state.session);
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [notifications, setNotifications] = useState<{ id: string; text: string; time: string }[]>([]);

    useEffect(() => {
        try {
            setNotifications(JSON.parse(localStorage.getItem('pharma_notifications') || '[]'));
        } catch (_) { }
    }, []);

    const clearNotifications = () => {
        localStorage.setItem('pharma_notifications', '[]');
        setNotifications([]);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6 shadow-sm">
            <div className="flex items-center gap-4 flex-1">
                <SidebarTrigger className="-ml-1" />
                <div className="hidden md:flex flex-1 max-w-2xl">
                    <SearchBar />
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Dark mode toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label="Toggle theme"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                            <Bell className="h-5 w-5" />
                            {notifications.length > 0 && (
                                <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-destructive" />
                            )}
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel className="flex items-center justify-between">
                            <span>Notifications</span>
                            {notifications.length > 0 && (
                                <button onClick={clearNotifications} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-normal">
                                    <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                                </button>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                                <Bell className="h-8 w-8 text-muted-foreground/30" />
                                <p className="text-sm font-medium text-muted-foreground">No new notifications</p>
                                <p className="text-xs text-muted-foreground/60">You&apos;re all caught up!</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <DropdownMenuItem key={n.id} className="flex items-start gap-3 py-3 cursor-default">
                                    <Package className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm leading-snug">{n.text}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                                    </div>
                                </DropdownMenuItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {session ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                                <User className="h-4 w-4 text-primary" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Account</p>
                                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push('/profile')}>
                                My Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/profile')}>
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button variant="default" size="sm" asChild>
                        <Link href="/auth">Sign In</Link>
                    </Button>
                )}
            </div>
        </header>
    );
}
