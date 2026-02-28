'use client';

import { useEffect } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from '@/components/ui/sidebar';
import { FileText, FlaskConical, ShieldCheck, Stethoscope, Settings, Beaker, BriefcaseMedical, Cross, Microscope, BookOpen, Info, User, GraduationCap, PackageOpen, Wrench, Presentation, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePharmaStore } from '@/data/store';

const mainNavItems = [
    { title: 'SOP Database', url: '/sops', icon: FileText },
    { title: 'Policies', url: '/policies', icon: BookOpen },
    { title: 'Presentations', url: '/presentations', icon: Presentation },
    { title: 'Protocols & Reports', url: '/protocols-reports', icon: Microscope },
    { title: 'Checklists & Formats', url: '/checklists-formats', icon: ClipboardCheck },
    { title: 'Bundles & Packages', url: '/bundles', icon: PackageOpen },
    { title: 'Courses & Training', url: '/courses', icon: GraduationCap },
    { title: 'Career Resources', url: '/resources', icon: Wrench },
];

const iconMap: Record<string, any> = {
    ShieldCheck, FlaskConical, Stethoscope, FileText,
    Beaker, BriefcaseMedical, Cross, Microscope, Settings
};

export function AppSidebar() {
    const pathname = usePathname();
    const departments = usePharmaStore(state => state.departments);

    useEffect(() => {
        usePharmaStore.getState().initialize();
    }, []);

    return (
        <Sidebar variant="inset" className="border-r border-border/50 bg-sidebar/80 backdrop-blur-xl">
            <SidebarHeader className="h-16 flex items-center px-5 border-b border-border/50">
                <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight group">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary/80 flex items-center justify-center shadow-md">
                        <ShieldCheck className="h-4 w-4 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-primary to-secondary dark:from-primary dark:to-primary/60 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                        Sark Pharma Tech
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-2 py-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 mb-1">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname.startsWith(item.url)}
                                        className="rounded-lg transition-all text-slate-600 dark:text-slate-300 font-medium hover:bg-primary/10 hover:text-foreground data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-bold"
                                    >
                                        <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                                            <item.icon className="h-4 w-4 shrink-0" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {departments.length > 0 && (
                    <SidebarGroup className="mt-4">
                        <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 mb-1">
                            Departments
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {departments.map((item) => {
                                    const IconComponent = iconMap[item.icon] || FileText;
                                    return (
                                        <SidebarMenuItem key={item.id}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={pathname.startsWith(item.url)}
                                                className="rounded-lg transition-all text-slate-600 dark:text-slate-300 font-medium hover:bg-primary/10 hover:text-foreground data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-bold"
                                            >
                                                <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                                                    <IconComponent className="h-4 w-4 shrink-0" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-border/50 px-3 py-3 space-y-1">
                <Link
                    href="/profile"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/10 ${pathname === '/profile' ? 'bg-primary/15 text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <User className="h-4 w-4 shrink-0" />
                    <span>My Profile</span>
                </Link>
                <Link
                    href="/about"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/10 ${pathname === '/about' ? 'bg-primary/15 text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <Info className="h-4 w-4 shrink-0" />
                    <span>About</span>
                </Link>
            </SidebarFooter>
        </Sidebar>
    );
}
