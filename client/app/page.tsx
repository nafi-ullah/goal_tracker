'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target, 
  TrendingUp, 
  Award, 
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const user = auth.getUser();
    if (user) {
      router.push('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          {/* Logo/Icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 blur-3xl opacity-30">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-3xl shadow-2xl">
              <Target className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Goal Tracker
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl">
            Transform your dreams into achievements
          </p>
          
          <p className="text-lg text-muted-foreground/80 mb-12 max-w-xl">
            Track your progress, manage resources, and achieve your goals with our intelligent tracking system.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => router.push('/signup')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 hover:border-blue-500/50">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-2xl">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-center">Set Goals</CardTitle>
                <CardDescription className="text-center">
                  Define your objectives with clear targets and deadlines
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 hover:border-purple-500/50">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-center">Track Resources</CardTitle>
                <CardDescription className="text-center">
                  Manage learning materials and resources efficiently
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 hover:border-green-500/50">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-2xl">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-center">Monitor Progress</CardTitle>
                <CardDescription className="text-center">
                  Visualize your journey with detailed analytics
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-6 w-6 text-yellow-500" />
                <span className="text-3xl font-bold text-foreground">Track</span>
              </div>
              <p className="text-sm text-muted-foreground">Your Goals</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-purple-500" />
                <span className="text-3xl font-bold text-foreground">Achieve</span>
              </div>
              <p className="text-sm text-muted-foreground">Your Dreams</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <span className="text-3xl font-bold text-foreground">Grow</span>
              </div>
              <p className="text-sm text-muted-foreground">Every Day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 Goal Tracker. Start your journey today.</p>
        </div>
      </footer>
    </div>
  );
}
