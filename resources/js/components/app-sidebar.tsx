import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { usePermission } from '@/hooks/usePermission';
import { type NavItem, type InertiaPageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, IdCard, Fingerprint, Folder, LayoutGrid, Shield, Users, Lock, FileText, Wheat, DollarSign, User2, BadgeDollarSign, BadgeEuro, Calculator } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Clientes',
        href: '/clients',
        icon: Users,
    }
];

const superAdminNavItems: NavItem[] = [
    {
        title: 'Roles',
        href: '/roles',
        icon: Users,
    },
    {
        title: 'Permissions',
        href: '/permissions',
        icon: Lock,
    }
];

const adminNavItems: NavItem[] = [

    {
        title: 'Roles Permissions',
        href: '/roles-permissions',
        icon: Shield,
    },
    {
        title: 'Users',
        href: '/users',
        icon: User2,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<InertiaPageProps>().props;
    const { hasPermission } = usePermission();

    // Verificamos primero si auth.user existe y luego si tiene role antes de acceder a name
    const isSuperAdmin = auth?.user?.is_superadmin === true || auth?.user?.role?.name === 'superadmin';
    const isAdmin = auth?.user?.is_superadmin === true || auth?.user?.role?.name === 'admin';

    // Creamos elementos de navegación basados en permisos
    let navItems = [...mainNavItems]; // Siempre incluimos los elementos principales

    // Añadimos elementos de administración según permisos
    if (isSuperAdmin || hasPermission('view_roles')) {
        navItems = [...superAdminNavItems, ...navItems];
    }

    if (isAdmin || hasPermission('view_roles_permissions')) {
        navItems = [...adminNavItems, ...navItems];
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
