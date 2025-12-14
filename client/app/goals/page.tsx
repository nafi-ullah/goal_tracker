'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { goalApi } from '@/lib/api';
import { Goal } from '@/types';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus,
  Target,
  Calendar,
  TrendingUp,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward_type: 'Points',
    target_value: 100,
    initial_value: 0,
    domain_name: '',
    target_date: '',
  });

  useEffect(() => {
    const user = auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    loadGoals(user.user_id);
  }, [router]);

  const loadGoals = async (userId: number) => {
    try {
      const data = await goalApi.getByUser(userId) as Goal[];
      setGoals(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.getUser();
    if (!user) return;

    setCreating(true);
    try {
      await goalApi.create({
        user_id: user.user_id,
        ...formData,
        target_date: formData.target_date || undefined,
      });
      
      setDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        reward_type: 'Points',
        target_value: 100,
        initial_value: 0,
        domain_name: '',
        target_date: '',
      });
      
      await loadGoals(user.user_id);
    } catch (err: any) {
      setError(err.message || 'Failed to create goal');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Goals</h1>
            <p className="text-muted-foreground">Manage and track all your goals</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-lg">
                <Plus className="mr-2 h-5 w-5" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleCreateGoal}>
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>
                    Set up a new goal to start tracking your progress
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Learn Python"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Master Python programming..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="initial_value">Initial Value</Label>
                      <Input
                        id="initial_value"
                        type="number"
                        value={formData.initial_value}
                        onChange={(e) => setFormData({ ...formData, initial_value: parseFloat(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target_value">Target Value *</Label>
                      <Input
                        id="target_value"
                        type="number"
                        required
                        value={formData.target_value}
                        onChange={(e) => setFormData({ ...formData, target_value: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reward_type">Reward Type</Label>
                    <Input
                      id="reward_type"
                      placeholder="Points, Hours, Projects..."
                      value={formData.reward_type}
                      onChange={(e) => setFormData({ ...formData, reward_type: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain_name">Domain</Label>
                    <Input
                      id="domain_name"
                      placeholder="Programming, Fitness..."
                      value={formData.domain_name}
                      onChange={(e) => setFormData({ ...formData, domain_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target_date">Target Date</Label>
                    <Input
                      id="target_date"
                      type="date"
                      value={formData.target_date}
                      onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={creating}>
                    {creating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Goal'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {goals.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Target className="h-20 w-20 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Start your journey by creating your first goal. Set targets, track progress, and achieve more!
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <Link key={goal.goal_id} href={`/goals/${goal.goal_id}`}>
                <Card className="h-full hover:shadow-xl transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Target className="h-8 w-8 text-primary" />
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {goal.title}
                    </CardTitle>
                    {goal.description && (
                      <CardDescription className="line-clamp-2">
                        {goal.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {goal.domain_name && (
                        <Badge variant="outline">{goal.domain_name}</Badge>
                      )}
                      {goal.reward_type && (
                        <Badge variant="secondary">{goal.reward_type}</Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-muted-foreground">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Target
                        </span>
                        <span className="font-medium">
                          {goal.initial_value} → {goal.target_value}
                        </span>
                      </div>

                      {goal.target_date && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due Date
                          </span>
                          <span className="font-medium">
                            {format(new Date(goal.target_date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
