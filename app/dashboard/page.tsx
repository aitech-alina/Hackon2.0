'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  FileText,
  Upload,
  TrendingUp,
  Calendar,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock statistics
  const stats = [
    {
      label: 'Total Documents',
      value: '248',
      icon: FileText,
      color: 'text-primary',
    },
    {
      label: 'This Month',
      value: '42',
      icon: Calendar,
      color: 'text-accent',
    },
    {
      label: 'Processed Today',
      value: '12',
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      label: 'Team Members',
      value: '5',
      icon: Users,
      color: 'text-accent',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your documents today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-accent/10 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest document uploads and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Document {item}.pdf</p>
                      <p className="text-xs text-muted-foreground">Uploaded 2 hours ago</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-accent/20 text-accent-foreground rounded">Invoice</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 justify-start" asChild>
              <Link href="/dashboard/upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start border-border" asChild>
              <Link href="/dashboard/documents">
                <FileText className="w-4 h-4 mr-2" />
                View All Documents
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start border-border" asChild>
              <Link href="/dashboard/reports">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Usage Chart */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Storage Usage</CardTitle>
          <CardDescription>Your current storage consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Used</span>
                <span className="text-sm text-muted-foreground">5.2 GB / 100 GB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '5.2%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
