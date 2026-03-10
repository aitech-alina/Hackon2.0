'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Upload,
  FileText,
  BarChart3,
  Zap,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Upload',
      href: '/dashboard/upload',
      icon: Upload,
    },
    {
      label: 'Documents',
      href: '/dashboard/documents',
      icon: FileText,
    },
    {
      label: 'Reports',
      href: '/dashboard/reports',
      icon: BarChart3,
    },
    {
      label: 'Automation',
      href: '/dashboard/automation',
      icon: Zap,
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`bg-primary text-primary-foreground transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-primary-foreground/20 flex items-center justify-between">
        {!isCollapsed && <span className="font-bold">Navigation</span>}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-primary-foreground hover:bg-primary/80"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-primary/80 text-primary-foreground'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-primary-foreground/20 p-4 space-y-2">
        {!isCollapsed && (
          <div className="text-xs text-primary-foreground/70 px-4">
            <p className="font-semibold mb-1">DocManager Pro</p>
            <p>Storage: 5.2 GB / 100 GB</p>
          </div>
        )}
      </div>
    </aside>
  );
}
