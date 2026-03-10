'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Search,
  Download,
  Trash2,
  MoreVertical,
  Filter,
  Eye,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedDate: string;
  category: string;
  status: 'processed' | 'processing' | 'pending';
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock data
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Invoice_2024_Q1.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedDate: '2024-03-15',
      category: 'invoice',
      status: 'processed',
    },
    {
      id: '2',
      name: 'Receipt_Expense.pdf',
      type: 'PDF',
      size: '1.2 MB',
      uploadedDate: '2024-03-14',
      category: 'receipt',
      status: 'processed',
    },
    {
      id: '3',
      name: 'Contract_Document.pdf',
      type: 'PDF',
      size: '3.8 MB',
      uploadedDate: '2024-03-13',
      category: 'legal',
      status: 'processed',
    },
    {
      id: '4',
      name: 'Financial_Report.jpg',
      type: 'JPEG',
      size: '1.1 MB',
      uploadedDate: '2024-03-12',
      category: 'finance',
      status: 'processing',
    },
    {
      id: '5',
      name: 'Scanned_Document.png',
      type: 'PNG',
      size: '0.9 MB',
      uploadedDate: '2024-03-11',
      category: 'personal',
      status: 'pending',
    },
  ];

  // Filter and search logic
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort logic
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime();
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'size') {
      return parseInt(b.size) - parseInt(a.size);
    }
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
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
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Documents
        </h1>
        <p className="text-muted-foreground">
          Search and manage all your uploaded documents
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="border-border mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-border"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="invoice">Invoices</SelectItem>
                  <SelectItem value="receipt">Receipts</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="size">File Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {sortedDocuments.length > 0 ? (
        <div className="space-y-3">
          {sortedDocuments.map((doc) => (
            <Card key={doc.id} className="border-border hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Document Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-accent/20 flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {doc.size} • Uploaded {doc.uploadedDate}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <span className={`px-2 py-1 text-xs rounded font-medium ${getCategoryBadgeColor(doc.category)}`}>
                      {doc.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
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
      ) : (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No documents found
            </h3>
            <p className="text-muted-foreground">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your first document to get started'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="mt-6 text-sm text-muted-foreground">
        Showing {sortedDocuments.length} of {mockDocuments.length} documents
      </div>
    </div>
  );
}
