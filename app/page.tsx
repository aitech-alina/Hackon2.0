'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Upload,
  Search,
  BarChart3,
  Zap,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 md:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent">
            <span className="text-sm font-medium text-foreground">
              ✨ Introducing Smart Document Management
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
            Manage Your Documents with AI-Powered Intelligence
          </h1>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Upload, organize, search, and extract data from your documents instantly. Powered by advanced OCR technology and intelligent automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push('/register')}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border"
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Powerful Features for Document Management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to streamline your document workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Smart Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Drag and drop or upload documents in multiple formats. Supports PDF, images, and scanned files.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Advanced Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Find documents instantly with full-text search and intelligent categorization powered by AI.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get insights into your document management with detailed analytics and usage statistics.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Automation Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Set up automated workflows to organize and process documents based on custom rules.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Bank-level encryption and security to keep your sensitive documents safe and secure.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Fast Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get instant results with our optimized OCR engine that processes documents in seconds.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground">Upload Document</h3>
              <p className="text-muted-foreground">
                Upload your documents by dragging and dropping or selecting files from your device.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground">Select Category</h3>
              <p className="text-muted-foreground">
                Choose a document category or let our AI automatically categorize it for you.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground">Extract & Manage</h3>
              <p className="text-muted-foreground">
                Instantly extract data and manage your documents with powerful search and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-accent/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Transform Your Document Management?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of businesses that trust DocManager for intelligent document management.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push('/register')}
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required. Get access to all features for free.
          </p>
        </div>
      </section>
    </div>
  );
}
