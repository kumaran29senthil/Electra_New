"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboardIcon,
  VoteIcon,
  CalendarIcon,
  UsersIcon,
  HistoryIcon,
  BellIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
  UserIcon,
  ShieldIcon,
  ListChecksIcon,
  TrophyIcon,
  SettingsIcon,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, userRole, logOut } = useAuth();
  const { toast } = useToast();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      // Check if we're in admin area but not logged in as admin
      if (pathname?.includes('admin') && !localStorage.getItem('adminAuthenticated')) {
        window.location.href = '/login';
      }
    }
  }, [user, pathname]);

  const handleLogout = async () => {
    try {
      await logOut();
      localStorage.removeItem('adminAuthenticated');
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
      window.location.href = '/';
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to log out',
      });
    }
  };

  // Get navigation items based on user role
  const getNavItems = () => {
    const role = pathname?.includes('admin') 
      ? 'admin' 
      : pathname?.includes('candidate') 
        ? 'candidate' 
        : 'voter';

    // Admin navigation
    if (role === 'admin') {
      return [
        {
          title: 'Dashboard',
          href: '/admin-dashboard',
          icon: <LayoutDashboardIcon className="h-5 w-5" />,
        },
        {
          title: 'Elections',
          href: '/admin-dashboard/elections',
          icon: <VoteIcon className="h-5 w-5" />,
        },
        {
          title: 'Candidates',
          href: '/admin-dashboard/candidates',
          icon: <UsersIcon className="h-5 w-5" />,
        },
        {
          title: 'Fraud Detection',
          href: '/admin-dashboard/fraud',
          icon: <ShieldIcon className="h-5 w-5" />,
        },
        {
          title: 'Analytics',
          href: '/admin-dashboard/analytics',
          icon: <HistoryIcon className="h-5 w-5" />,
        },
        {
          title: 'Settings',
          href: '/admin-dashboard/settings',
          icon: <SettingsIcon className="h-5 w-5" />,
        },
      ];
    }
    
    // Candidate navigation
    if (role === 'candidate') {
      return [
        {
          title: 'Dashboard',
          href: '/candidate-dashboard',
          icon: <LayoutDashboardIcon className="h-5 w-5" />,
        },
        {
          title: 'My Applications',
          href: '/candidate-dashboard/applications',
          icon: <ListChecksIcon className="h-5 w-5" />,
        },
        {
          title: 'Elections',
          href: '/candidate-dashboard/elections',
          icon: <VoteIcon className="h-5 w-5" />,
        },
        {
          title: 'Results',
          href: '/candidate-dashboard/results',
          icon: <TrophyIcon className="h-5 w-5" />,
        },
        {
          title: 'Profile',
          href: '/candidate-dashboard/profile',
          icon: <UserIcon className="h-5 w-5" />,
        },
      ];
    }
    
    // Voter navigation (default)
    return [
      {
        title: 'Dashboard',
        href: '/voter-dashboard',
        icon: <LayoutDashboardIcon className="h-5 w-5" />,
      },
      {
        title: 'Elections',
        href: '/voter-dashboard/elections',
        icon: <VoteIcon className="h-5 w-5" />,
      },
      {
        title: 'Upcoming',
        href: '/voter-dashboard/upcoming',
        icon: <CalendarIcon className="h-5 w-5" />,
      },
      {
        title: 'History',
        href: '/voter-dashboard/history',
        icon: <HistoryIcon className="h-5 w-5" />,
      },
      {
        title: 'ID',
        href: '/voter-dashboard/id',
        icon: <UserIcon className="h-5 w-5" />,
      },
    ];
  };

  const navItems = getNavItems();

  const renderSidebarContent = () => (
    <>
      <div className="flex h-20 items-center px-4 py-6">
        <Link href="/" className="flex items-center">
          <VoteIcon className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">Electra</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col gap-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={`w-full justify-start gap-2 ${
                  pathname === item.href ? "bg-muted" : ""
                }`}
              >
                {item.icon}
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-destructive hover:text-destructive" 
          onClick={handleLogout}
        >
          <LogOutIcon className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile sidebar */}
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0">
                {renderSidebarContent()}
              </SheetContent>
            </Sheet>
            <VoteIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Electra</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <BellIcon className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-background lg:flex">
          {renderSidebarContent()}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}