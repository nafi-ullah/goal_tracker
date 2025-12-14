'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { goalApi } from '@/lib/api';
import { GoalDetail, ResourceDetail } from '@/types';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen,
  Loader2,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function ResourcesPage() {
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

    loadResources(user.user_id);
  }, [router]);

  const loadResources = async (userId: number) => {
    try {
      const data = await goalApi.getDetailsById(userId) as GoalDetail[];
      setGoals(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  // Flatten all resources from all goals
  const allResources: Array<ResourceDetail & { goalTitle: string; goalId: number }> = goals.flatMap(
    (goal) => goal.resources.map((resource) => ({
      ...resource,
      goalTitle: goal.title,
      goalId: goal.goal_id,
    }))
  );

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
          <h1 className="text-4xl font-bold mb-2">All Resources</h1>
          <p className="text-muted-foreground">
            Browse all your learning resources across all goals
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {allResources.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-20 w-20 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Start by creating a goal and adding resources to track your learning progress
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allResources.map((resource) => {
              const completionPercent = resource.total_topic_points > 0
                ? (resource.completed_points_resources / resource.total_topic_points) * 100
                : 0;
              
              return (
                <Link key={resource.resource_id} href={`/resources/${resource.resource_id}`}>
                  <Card className="h-full hover:shadow-xl transition-all cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-6 w-6 text-primary" />
                          <Badge variant="outline">{resource.resource_type}</Badge>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {resource.title}
                      </CardTitle>
                      <CardDescription>
                        From: {resource.goalTitle}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {resource.note && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {resource.note}
                        </p>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{completionPercent.toFixed(0)}%</span>
                        </div>
                        <Progress value={completionPercent} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <div>
                            <div className="font-medium">{resource.completed_points_resources.toFixed(0)}</div>
                            <div className="text-xs text-muted-foreground">Completed</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="font-medium">{resource.topics.length}</div>
                            <div className="text-xs text-muted-foreground">Topics</div>
                          </div>
                        </div>
                      </div>

                      {resource.resource_link && (
                        <div className="flex items-center text-sm text-primary pt-2 border-t">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          <span className="truncate">View Resource</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Group by Goal */}
        {goals.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Resources by Goal</h2>
            <div className="space-y-6">
              {goals.map((goal) => {
                if (goal.resources.length === 0) return null;
                
                return (
                  <Card key={goal.goal_id} className="shadow-lg">
                    <CardHeader>
                      <CardTitle>{goal.title}</CardTitle>
                      <CardDescription>{goal.resources.length} resources</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {goal.resources.map((resource) => {
                          const completionPercent = resource.total_topic_points > 0
                            ? (resource.completed_points_resources / resource.total_topic_points) * 100
                            : 0;
                          
                          return (
                            <Link key={resource.resource_id} href={`/resources/${resource.resource_id}`}>
                              <div className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {resource.resource_type}
                                  </Badge>
                                  <span className="text-xs font-medium">
                                    {completionPercent.toFixed(0)}%
                                  </span>
                                </div>
                                <h4 className="font-medium mb-2 line-clamp-1">{resource.title}</h4>
                                <Progress value={completionPercent} className="h-1.5" />
                                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                  <span>{resource.topics.length} topics</span>
                                  {resource.total_time_per_unit && (
                                    <span className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {resource.total_time_per_unit}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
