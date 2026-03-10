'use client';

import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Lock, Eye, Trash2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'privacy', label: 'Privacy', icon: '👁️' },
    { id: 'storage', label: 'Storage', icon: '💾' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <Input
                      defaultValue={user?.name}
                      disabled
                      className="border-border bg-muted"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      defaultValue={user?.email}
                      disabled
                      className="border-border bg-muted"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Plan
                    </label>
                    <Input
                      defaultValue="DocManager Pro"
                      disabled
                      className="border-border bg-muted"
                    />
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-border justify-start gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive/10 justify-start gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        Email Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        Push Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Receive browser notifications
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold text-foreground mb-4">
                    Notification Types
                  </h3>
                  <div className="space-y-3">
                    {[
                      'Document uploaded',
                      'Processing complete',
                      'Errors detected',
                      'Weekly summary',
                    ].map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded border-border"
                        />
                        <label className="text-sm text-foreground">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Update your password regularly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="border-border"
                    />
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="border-border w-full sm:w-auto">
                    Enable 2FA
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Privacy */}
          {activeTab === 'privacy' && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Dark Mode
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme for the interface
                    </p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold text-foreground mb-4">
                    Data & Privacy
                  </h3>
                  <div className="space-y-3">
                    {[
                      'Share usage analytics',
                      'Allow AI analysis of documents',
                      'Store document backups',
                    ].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded border-border"
                        />
                        <label className="text-sm text-foreground">{option}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Storage */}
          {activeTab === 'storage' && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Storage Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Storage Used
                    </span>
                    <span className="text-sm text-muted-foreground">
                      52.3 GB / 100 GB
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: '52.3%' }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">248</p>
                    <p className="text-xs text-muted-foreground">Documents</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">1,524</p>
                    <p className="text-xs text-muted-foreground">Pages</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">47.7</p>
                    <p className="text-xs text-muted-foreground">GB Available</p>
                  </div>
                </div>

                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
