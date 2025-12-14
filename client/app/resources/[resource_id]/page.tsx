'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { resourceApi, topicApi } from '@/lib/api';
import { Resource, Topic } from '@/types';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { 
  Plus,
  CheckCircle2,
  Circle,
  Loader2,
  ExternalLink,
  ArrowLeft,
  Trash2,
  SkipForward,
  Clock,
  Award
} from 'lucide-react';
import { format } from 'date-fns';

export default function ResourceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const resourceId = parseInt(params.resource_id as string);

  const [resource, setResource] = useState<Resource | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    point_multiplier: 1.0,
  });
  const [bulkTopics, setBulkTopics] = useState('');

  useEffect(() => {
    const user = auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    loadResourceData();
  }, [resourceId, router]);

  const loadResourceData = async () => {
    try {
      const [resourceData, topicsData] = await Promise.all([
        resourceApi.getById(resourceId) as Promise<Resource>,
        topicApi.getByResource(resourceId) as Promise<Topic[]>,
      ]);
      
      setResource(resourceData);
      setTopics(topicsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load resource data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      await topicApi.create({
        resource_id: resourceId,
        ...formData,
      });
      
      setDialogOpen(false);
      setFormData({
        title: '',
        point_multiplier: 1.0,
      });
      
      await loadResourceData();
    } catch (err: any) {
      setError(err.message || 'Failed to create topic');
    } finally {
      setCreating(false);
    }
  };

  const handleBulkCreateTopics = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      const topicLines = bulkTopics.split('\n').filter(line => line.trim());
      const topicsList = topicLines.map(line => ({
        title: line.trim(),
        point_multiplier: 1.0,
      }));

      await topicApi.bulkCreate({
        resource_id: resourceId,
        topics: topicsList,
      });
      
      setBulkDialogOpen(false);
      setBulkTopics('');
      
      await loadResourceData();
    } catch (err: any) {
      setError(err.message || 'Failed to create topics');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleComplete = async (topic: Topic) => {
    try {
      await topicApi.updateStatus(topic.topic_id, {
        is_completed: !topic.is_completed,
      });
      await loadResourceData();
    } catch (err: any) {
      setError(err.message || 'Failed to update topic');
    }
  };

  const handleToggleSkip = async (topic: Topic) => {
    try {
      await topicApi.updateStatus(topic.topic_id, {
        is_skipped: !topic.is_skipped,
      });
      await loadResourceData();
    } catch (err: any) {
      setError(err.message || 'Failed to update topic');
    }
  };

  const handleDeleteTopic = async (topicId: number) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;
    
    try {
      await topicApi.delete(topicId);
      await loadResourceData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete topic');
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

  if (!resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>Resource not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const completedTopics = topics.filter(t => t.is_completed).length;
  const totalTopics = topics.length;
  const completionPercent = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link href="/resources">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Button>
        </Link>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Resource Header */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{resource.resource_type}</Badge>
                </div>
                <CardTitle className="text-3xl mb-2">{resource.title}</CardTitle>
                {resource.note && (
                  <CardDescription className="text-base">{resource.note}</CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {resource.value_per_unit && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Value/Unit</div>
                  <div className="text-2xl font-bold">{resource.value_per_unit}</div>
                </div>
              )}
              {resource.total_time_per_unit && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Time/Unit</div>
                  <div className="text-lg font-semibold flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {resource.total_time_per_unit}
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Completion</div>
                <div className="text-2xl font-bold">{completionPercent.toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Topics</div>
                <div className="text-2xl font-bold">{completedTopics}/{totalTopics}</div>
              </div>
            </div>

            <Progress value={completionPercent} className="h-3" />

            {resource.resource_link && (
              <div className="pt-4">
                <a 
                  href={resource.resource_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Resource Link
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Topics Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Topics</h2>
            <p className="text-muted-foreground">Track individual topics or chapters</p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Bulk Add
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <form onSubmit={handleBulkCreateTopics}>
                  <DialogHeader>
                    <DialogTitle>Bulk Add Topics</DialogTitle>
                    <DialogDescription>
                      Enter one topic per line
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="bulk_topics">Topics (one per line)</Label>
                      <textarea
                        id="bulk_topics"
                        className="w-full min-h-[200px] p-3 border rounded-md"
                        placeholder="Chapter 1: Introduction&#10;Chapter 2: Getting Started&#10;Chapter 3: Advanced Topics"
                        value={bulkTopics}
                        onChange={(e) => setBulkTopics(e.target.value)}
                        required
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
                        'Add Topics'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Topic
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <form onSubmit={handleCreateTopic}>
                  <DialogHeader>
                    <DialogTitle>Add New Topic</DialogTitle>
                    <DialogDescription>
                      Add a topic or chapter to track
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Chapter 1: Introduction"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="point_multiplier">Point Multiplier</Label>
                      <Input
                        id="point_multiplier"
                        type="number"
                        step="0.1"
                        value={formData.point_multiplier}
                        onChange={(e) => setFormData({ ...formData, point_multiplier: parseFloat(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Used to calculate topic points (value × multiplier)
                      </p>
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
                        'Add Topic'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {topics.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Award className="h-20 w-20 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No topics yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Add topics or chapters to track your progress through this resource
              </p>
              <div className="flex gap-2">
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Topic
                </Button>
                <Button variant="outline" onClick={() => setBulkDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Bulk Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {topics.map((topic) => (
              <Card 
                key={topic.topic_id} 
                className={`shadow-md transition-all ${
                  topic.is_completed ? 'bg-green-50 dark:bg-green-900/10' : 
                  topic.is_skipped ? 'bg-gray-100 dark:bg-gray-800/50 opacity-60' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleComplete(topic)}
                      className="mt-1 flex-shrink-0"
                    >
                      {topic.is_completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400 hover:text-primary transition-colors" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium mb-1 ${topic.is_completed ? 'line-through' : ''}`}>
                        {topic.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          Multiplier: {topic.point_multiplier}
                        </Badge>
                        
                        {topic.is_skipped && (
                          <Badge variant="outline" className="text-xs">
                            Skipped
                          </Badge>
                        )}
                        
                        {topic.complete_date && (
                          <span className="text-xs">
                            Completed: {format(new Date(topic.complete_date), 'MMM dd, yyyy')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleSkip(topic)}
                        title={topic.is_skipped ? 'Unskip' : 'Skip'}
                      >
                        <SkipForward className={`h-4 w-4 ${topic.is_skipped ? 'text-orange-500' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTopic(topic.topic_id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
