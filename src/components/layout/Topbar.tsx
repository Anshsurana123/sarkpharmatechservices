'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { SearchBar } from '@/components/shared/SearchBar';
import { Bell, User, Sun, Moon } from 'lucide-react';
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

export function Topbar() {
    const session = usePharmaStore(state => state.session);
    const { theme, setTheme } = useTheme();

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

                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary" onClick={() => alert("Notifications coming soon!")}>
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-destructive" />
                    <span className="sr-only">Notifications</span>
                </Button>

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
                            <DropdownMenuItem onClick={() => alert("Profile settings coming soon!")}>Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert("Settings coming soon!")}>Settings</DropdownMenuItem>
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
