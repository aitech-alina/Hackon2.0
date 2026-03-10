'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Zap,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  category: string;
  enabled: boolean;
}

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Auto-categorize Invoices',
      trigger: 'Document contains "Invoice"',
      action: 'Auto-tag as Invoice',
      category: 'invoice',
      enabled: true,
    },
    {
      id: '2',
      name: 'Archive Old Documents',
      trigger: 'Document older than 90 days',
      action: 'Move to Archive',
      category: 'personal',
      enabled: true,
    },
    {
      id: '3',
      name: 'Alert on Large Files',
      trigger: 'File size > 10MB',
      action: 'Send notification',
      category: 'work',
      enabled: false,
    },
  ]);

  const [showNewRule, setShowNewRule] = useState(false);

  const toggleRule = (id: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      invoice: 'bg-blue-100 text-blue-800',
      receipt: 'bg-green-100 text-green-800',
      legal: 'bg-purple-100 text-purple-800',
      finance: 'bg-orange-100 text-orange-800',
      personal: 'bg-pink-100 text-pink-800',
      work: 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Automation Rules
          </h1>
          <p className="text-muted-foreground">
            Set up automated workflows to organize and process documents
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          onClick={() => setShowNewRule(!showNewRule)}
        >
          <Plus className="w-4 h-4" />
          New Rule
        </Button>
      </div>

      {/* New Rule Form */}
      {showNewRule && (
        <Card className="border-border mb-6 bg-accent/5">
          <CardHeader>
            <CardTitle>Create New Rule</CardTitle>
            <CardDescription>Set up a new automation rule for your documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rule Name
                </label>
                <Input
                  placeholder="e.g., Auto-categorize Receipts"
                  className="border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <Select>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="receipt">Receipt</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Trigger
                </label>
                <Select>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keyword">Document contains keyword</SelectItem>
                    <SelectItem value="size">File size exceeds limit</SelectItem>
                    <SelectItem value="date">Date based</SelectItem>
                    <SelectItem value="extension">File extension</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Action
                </label>
                <Select>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tag">Auto-tag</SelectItem>
                    <SelectItem value="move">Move to folder</SelectItem>
                    <SelectItem value="archive">Archive</SelectItem>
                    <SelectItem value="notify">Send notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                className="border-border"
                onClick={() => setShowNewRule(false)}
              >
                Cancel
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Rule
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <Card key={rule.id} className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleRule(rule.id)}
                  className="flex-shrink-0"
                >
                  {rule.enabled ? (
                    <ToggleRight className="w-5 h-5 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                  )}
                </Button>

                {/* Rule Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{rule.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground flex-wrap">
                    <span>{rule.trigger}</span>
                    <ArrowRight className="w-4 h-4" />
                    <span>{rule.action}</span>
                  </div>
                </div>

                {/* Category Badge */}
                <span className={`px-2 py-1 text-xs rounded font-medium flex-shrink-0 ${getCategoryColor(rule.category)}`}>
                  {rule.category}
                </span>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ⋮
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => deleteRule(rule.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Box */}
      <Card className="border-border mt-6 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Create rules based on document keywords to auto-categorize incoming uploads</p>
          <p>• Set up archive rules to automatically organize old documents</p>
          <p>• Use notifications to stay updated on important document types</p>
          <p>• Combine multiple triggers to create complex workflows</p>
        </CardContent>
      </Card>
    </div>
  );
}
