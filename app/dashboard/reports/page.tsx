'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('month');

  // Mock data for charts
  const documentTypeData = [
    { name: 'Invoices', value: 120, color: '#4E342E' },
    { name: 'Receipts', value: 85, color: '#D7CCC8' },
    { name: 'Legal', value: 45, color: '#A1887F' },
    { name: 'Finance', value: 60, color: '#8D6E63' },
    { name: 'Other', value: 38, color: '#BCAAA4' },
  ];

  const uploadTrendData = [
    { date: 'Mon', uploads: 12, processed: 10 },
    { date: 'Tue', uploads: 19, processed: 18 },
    { date: 'Wed', uploads: 15, processed: 14 },
    { date: 'Thu', uploads: 28, processed: 26 },
    { date: 'Fri', uploads: 22, processed: 21 },
    { date: 'Sat', uploads: 8, processed: 8 },
    { date: 'Sun', uploads: 5, processed: 5 },
  ];

  const processingTimeData = [
    { category: 'Invoices', time: 2.4 },
    { category: 'Receipts', time: 2.1 },
    { category: 'Legal', time: 3.2 },
    { category: 'Finance', time: 2.8 },
    { category: 'Personal', time: 1.9 },
  ];

  const stats = [
    { label: 'Total Documents', value: '348', change: '+12%', icon: '📄' },
    { label: 'Avg Processing Time', value: '2.5s', change: '-8%', icon: '⚡' },
    { label: 'Success Rate', value: '99.8%', change: '+0.2%', icon: '✓' },
    { label: 'Storage Used', value: '52.3GB', change: '+18%', icon: '💾' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Detailed insights and statistics about your documents
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change} from last period
                  </p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Document Type Distribution */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Document Type Distribution</CardTitle>
            <CardDescription>Breakdown of uploaded documents by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={documentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {documentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upload Trend */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Upload Trend</CardTitle>
            <CardDescription>Weekly upload and processing activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={uploadTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="uploads"
                  stroke="#4E342E"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="processed"
                  stroke="#D7CCC8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Processing Time by Category */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Average Processing Time by Category</CardTitle>
          <CardDescription>Processing duration in seconds for each document category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processingTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="category" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Bar dataKey="time" fill="#4E342E" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Most Used Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">Invoices</p>
              <p className="text-sm text-muted-foreground">120 documents (34.5%)</p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: '34.5%' }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Peak Upload Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">Thursday</p>
              <p className="text-sm text-muted-foreground">28 uploads this week</p>
              <p className="text-xs text-accent mt-3">Most active day</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">99.8%</p>
              <p className="text-sm text-muted-foreground">Uptime this month</p>
              <p className="text-xs text-green-600 mt-3">All systems operational</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
