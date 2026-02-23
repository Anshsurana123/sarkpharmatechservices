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
    SidebarFooter
} from '@/components/ui/sidebar';
import { FileText, FlaskConical, ShieldCheck, Stethoscope, Settings, Beaker, BriefcaseMedical, Cross, Microscope } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePharmaStore } from '@/data/store';

const mainNavItems = [
    { title: 'SOP Database', url: '/sops', icon: FileText },
];

// Helper to map string icon names back to Lucide components
const iconMap: Record<string, any> = {
    ShieldCheck,
    FlaskConical,
    Stethoscope,
    FileText,
    Beaker,
    BriefcaseMedical,
    Cross,
    Microscope,
    Settings
};

export function AppSidebar() {
    const pathname = usePathname();
    const departments = usePharmaStore(state => state.departments);

    useEffect(() => {
        usePharmaStore.getState().initialize();
    }, []);

    return (
        <Sidebar variant="inset">
            <SidebarHeader className="h-16 flex items-center px-4 border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary tracking-tight hover:opacity-80 transition-opacity">
                    <ShieldCheck className="h-6 w-6 text-secondary" />
                    <span>Sark Pharma Tech</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Departments</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {departments.map((item) => {
                                const IconComponent = iconMap[item.icon] || FileText;
                                return (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)}>
                                            <Link href={item.url}>
                                                <IconComponent />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
