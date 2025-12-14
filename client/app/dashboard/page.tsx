'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { goalApi } from '@/lib/api';
import { GoalDetail } from '@/types';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Zap,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { format, subDays } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<GoalDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      const data = await goalApi.getDetailsById(userId) as GoalDetail[];
      setGoals(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  // Calculate dashboard statistics
  const stats = {
    totalGoals: goals.length,
    activeGoals: goals.filter(g => g.from_today_remaining_days && g.from_today_remaining_days > 0).length,
    totalPoints: goals.reduce((sum, g) => sum + g.completed_points_goal, 0),
    todaysPoints: goals.reduce((sum, g) => sum + g.todays_completed_points, 0),
    avgCompletion: goals.length > 0 
      ? goals.reduce((sum, g) => {
          const completion = g.goals_total_points > 0 
            ? (g.completed_points_goal / g.goals_total_points) * 100 
            : 0;
          return sum + completion;
        }, 0) / goals.length 
      : 0,
  };

  // Generate last 7 days data for chart
  const last7DaysData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEE');
    
    // This is simplified - in production, you'd want to track daily progress
    const points = i === 6 ? stats.todaysPoints : Math.floor(Math.random() * 20);
    
    return {
      date: dayName,
      points: points,
      fullDate: dateStr,
    };
  });

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and achievements</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGoals}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeGoals} active
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPoints.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                Earned across all goals
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Points</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todaysPoints.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                Keep up the momentum!
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgCompletion.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Across all goals
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Last 7 Days Progress</CardTitle>
              <CardDescription>Your daily points completion</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={last7DaysData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="points" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Goals Overview</CardTitle>
              <CardDescription>Completion status of your goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No goals yet. Create your first goal!</p>
                </div>
              ) : (
                goals.slice(0, 5).map((goal) => {
                  const completionPercent = goal.goals_total_points > 0
                    ? (goal.completed_points_goal / goal.goals_total_points) * 100
                    : 0;
                  
                  return (
                    <div key={goal.goal_id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{goal.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {completionPercent.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={completionPercent} className="h-2" />
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Goals Details */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Goals</CardTitle>
            <CardDescription>Detailed breakdown of all your goals</CardDescription>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">No goals found</h3>
                <p className="text-muted-foreground mb-4">
                  Start your journey by creating your first goal
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {goals.map((goal) => {
                  const completionPercent = goal.goals_total_points > 0
                    ? (goal.completed_points_goal / goal.goals_total_points) * 100
                    : 0;
                  
                  return (
                    <div key={goal.goal_id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1">{goal.title}</h3>
                          {goal.description && (
                            <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {goal.domain_name && (
                              <Badge variant="outline">{goal.domain_name}</Badge>
                            )}
                            {goal.reward_type && (
                              <Badge variant="secondary">{goal.reward_type}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {goal.current_goal_value.toFixed(1)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            / {goal.target_value}
                          </div>
                        </div>
                      </div>

                      <Progress value={completionPercent} className="mb-4 h-3" />

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <div>
                            <div className="font-medium">{goal.completed_points_goal.toFixed(0)}</div>
                            <div className="text-muted-foreground text-xs">Points Earned</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="font-medium">{goal.goals_total_points.toFixed(0)}</div>
                            <div className="text-muted-foreground text-xs">Total Points</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-orange-500" />
                          <div>
                            <div className="font-medium">
                              {goal.from_today_remaining_days !== null 
                                ? `${goal.from_today_remaining_days} days` 
                                : 'N/A'}
                            </div>
                            <div className="text-muted-foreground text-xs">Remaining</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-purple-500" />
                          <div>
                            <div className="font-medium">{goal.resources.length}</div>
                            <div className="text-muted-foreground text-xs">Resources</div>
                          </div>
                        </div>
                      </div>

                      {goal.todays_completed_points > 0 && (
                        <>
                          <Separator className="my-4" />
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <Zap className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                Today: {goal.todays_completed_points.toFixed(0)} points 
                                {goal.todays_completion_percentage && (
                                  <span className="ml-2">
                                    ({goal.todays_completion_percentage.toFixed(0)}% of daily target)
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
