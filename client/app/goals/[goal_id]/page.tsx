'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { goalApi, resourceApi, topicApi } from '@/lib/api';
import { Goal, Resource, Topic } from '@/types';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus,
  BookOpen,
  CheckCircle2,
  Circle,
  Loader2,
  ExternalLink,
  ArrowLeft,
  Trash2
} from 'lucide-react';

export default function GoalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const goalId = parseInt(params.goal_id as string);

  const [goal, setGoal] = useState<Goal | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    resource_type: 'Book',
    title: '',
    value_per_unit: 10,
    total_time_per_unit: '',
    resource_link: '',
    note: '',
  });

  useEffect(() => {
    const user = auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    loadGoalData();
  }, [goalId, router]);

  const loadGoalData = async () => {
    try {
      const [goalData, resourcesData] = await Promise.all([
        goalApi.getById(goalId) as Promise<Goal>,
        resourceApi.getByGoal(goalId) as Promise<Resource[]>,
      ]);
      
      setGoal(goalData);
      setResources(resourcesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load goal data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      await resourceApi.create({
        goal_id: goalId,
        ...formData,
      });
      
      setDialogOpen(false);
      setFormData({
        resource_type: 'Book',
        title: '',
        value_per_unit: 10,
        total_time_per_unit: '',
        resource_link: '',
        note: '',
      });
      
      await loadGoalData();
    } catch (err: any) {
      setError(err.message || 'Failed to create resource');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteResource = async (resourceId: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      await resourceApi.delete(resourceId);
      await loadGoalData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete resource');
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

  if (!goal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>Goal not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link href="/goals">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Button>
        </Link>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Goal Header */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{goal.title}</CardTitle>
                {goal.description && (
                  <CardDescription className="text-base">{goal.description}</CardDescription>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {goal.domain_name && (
                    <Badge variant="outline">{goal.domain_name}</Badge>
                  )}
                  {goal.reward_type && (
                    <Badge variant="secondary">{goal.reward_type}</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Initial Value</div>
                <div className="text-2xl font-bold">{goal.initial_value}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Target Value</div>
                <div className="text-2xl font-bold">{goal.target_value}</div>
              </div>
              {goal.target_date && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Target Date</div>
                  <div className="text-lg font-semibold">{goal.target_date}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Resources</div>
                <div className="text-2xl font-bold">{resources.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Resources</h2>
            <p className="text-muted-foreground">Learning materials for this goal</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <form onSubmit={handleCreateResource}>
                <DialogHeader>
                  <DialogTitle>Add New Resource</DialogTitle>
                  <DialogDescription>
                    Add a learning resource to track progress
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="resource_type">Resource Type *</Label>
                    <Select
                      value={formData.resource_type}
                      onValueChange={(value) => setFormData({ ...formData, resource_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Book">Book</SelectItem>
                        <SelectItem value="Course">Course</SelectItem>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Article">Article</SelectItem>
                        <SelectItem value="Tutorial">Tutorial</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Python Crash Course"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value_per_unit">Value Per Unit</Label>
                    <Input
                      id="value_per_unit"
                      type="number"
                      value={formData.value_per_unit}
                      onChange={(e) => setFormData({ ...formData, value_per_unit: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total_time_per_unit">Time Per Unit</Label>
                    <Input
                      id="total_time_per_unit"
                      placeholder="30 minutes"
                      value={formData.total_time_per_unit}
                      onChange={(e) => setFormData({ ...formData, total_time_per_unit: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resource_link">Link (URL)</Label>
                    <Input
                      id="resource_link"
                      type="url"
                      placeholder="https://..."
                      value={formData.resource_link}
                      onChange={(e) => setFormData({ ...formData, resource_link: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Notes</Label>
                    <Textarea
                      id="note"
                      placeholder="Additional notes..."
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={creating}>
                    {creating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Resource'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {resources.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-20 w-20 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resources yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Add learning resources like books, courses, or videos to track your progress
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Resource
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resources.map((resource) => (
              <Link key={resource.resource_id} href={`/resources/${resource.resource_id}`}>
                <Card className="h-full hover:shadow-xl transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <Badge variant="outline">{resource.resource_type}</Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {resource.title}
                        </CardTitle>
                        {resource.note && (
                          <CardDescription className="mt-2 line-clamp-2">
                            {resource.note}
                          </CardDescription>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteResource(resource.resource_id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {resource.value_per_unit && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Value Per Unit</span>
                        <span className="font-medium">{resource.value_per_unit}</span>
                      </div>
                    )}

                    {resource.total_time_per_unit && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Time Per Unit</span>
                        <span className="font-medium">{resource.total_time_per_unit}</span>
                      </div>
                    )}

                    {resource.resource_link && (
                      <div className="flex items-center text-sm text-primary">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        <span className="truncate">View Resource</span>
                      </div>
                    )}
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
