import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedRequest } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, Clock, Target, Percent, TrendingUp } from "lucide-react";
import TimeChart from "@/components/charts/time-chart";

export default function TimeTracking() {
  const [currentTimer, setCurrentTimer] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      const res = await authenticatedRequest("GET", "/api/tasks");
      return res.json();
    },
  });

  const { data: timeEntries = [] } = useQuery({
    queryKey: ["/api/time-entries"],
    queryFn: async () => {
      const res = await authenticatedRequest("GET", "/api/time-entries");
      return res.json();
    },
  });

  const { data: activeEntry } = useQuery({
    queryKey: ["/api/time-entries/active"],
    queryFn: async () => {
      const res = await authenticatedRequest("GET", "/api/time-entries/active");
      return res.json();
    },
  });

  const startTimerMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await authenticatedRequest("POST", "/api/time-entries", {
        taskId,
        startTime: new Date().toISOString(),
      });
      return res.json();
    },
    onSuccess: (data) => {
      setCurrentTimer(data.taskId);
      setElapsedTime(0);
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
      toast({
        title: "Timer Started",
        description: "Time tracking started for this task.",
      });
    },
  });

  const stopTimerMutation = useMutation({
    mutationFn: async (entryId: string) => {
      const res = await authenticatedRequest("PUT", `/api/time-entries/${entryId}`, {
        endTime: new Date().toISOString(),
        duration: elapsedTime,
      });
      return res.json();
    },
    onSuccess: () => {
      setCurrentTimer(null);
      setElapsedTime(0);
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
      toast({
        title: "Timer Stopped",
        description: "Time entry saved successfully.",
      });
    },
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTodaysEntries = () => {
    const today = new Date().toDateString();
    return timeEntries.filter((entry: any) => {
      return new Date(entry.createdAt).toDateString() === today;
    });
  };

  const getTotalTimeToday = () => {
    const todaysEntries = getTodaysEntries();
    return todaysEntries.reduce((total: number, entry: any) => total + (entry.duration || 0), 0);
  };

  const getWeeklyTime = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyEntries = timeEntries.filter((entry: any) => {
      return new Date(entry.createdAt) >= weekAgo;
    });
    
    return weeklyEntries.reduce((total: number, entry: any) => total + (entry.duration || 0), 0);
  };

  const getActiveTask = () => {
    if (!currentTimer) return null;
    return tasks.find((task: any) => task.id === currentTimer);
  };

  const activeTask = getActiveTask();
  const todaysEntries = getTodaysEntries();
  const totalTimeToday = getTotalTimeToday();
  const weeklyTime = getWeeklyTime();

  // Simulate timer increment
  useState(() => {
    if (currentTimer) {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Time Tracking</h1>
        <p className="text-muted-foreground">Track your time and monitor productivity across tasks and projects.</p>
      </div>

      {/* Active Timer */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                {currentTimer ? (
                  <Pause className="h-8 w-8 text-primary" />
                ) : (
                  <Play className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                {activeTask ? (
                  <>
                    <h3 className="text-xl font-semibold text-foreground">{activeTask.title}</h3>
                    <p className="text-muted-foreground">
                      {tasks.find((t: any) => t.projectId)?.projectId || "Personal Task"}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-foreground">No Active Timer</h3>
                    <p className="text-muted-foreground">Start timing a task to track your work</p>
                  </>
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {formatTime(elapsedTime)}
              </div>
              <div className="flex space-x-2">
                {currentTimer ? (
                  <Button
                    variant="destructive"
                    onClick={() => activeEntry && stopTimerMutation.mutate(activeEntry.id)}
                    disabled={stopTimerMutation.isPending}
                    data-testid="button-stop-timer"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    disabled={tasks.length === 0}
                    onClick={() => tasks[0] && startTimerMutation.mutate(tasks[0].id)}
                    data-testid="button-start-timer"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                )}
                <Button variant="outline" disabled={!currentTimer}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Today's Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Time</span>
                <span className="font-semibold text-foreground">
                  {formatDuration(totalTimeToday)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tasks Worked On</span>
                <span className="font-semibold text-foreground">
                  {new Set(todaysEntries.map((e: any) => e.taskId)).size}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Productivity Score</span>
                <span className="font-semibold text-accent">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Time</span>
                <span className="font-semibold text-foreground">
                  {formatDuration(weeklyTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg per Day</span>
                <span className="font-semibold text-foreground">
                  {formatDuration(Math.floor(weeklyTime / 7))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Focus Time</span>
                <span className="font-semibold text-primary">89%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hours Worked</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Time Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeEntries.slice(0, 10).map((entry: any) => {
              const task = tasks.find((t: any) => t.id === entry.taskId);
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {task?.title || "Unknown Task"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {task?.projectId || "Personal Task"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {formatDuration(entry.duration || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
            {timeEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No time entries yet</p>
                <p className="text-sm">Start tracking time on your tasks to see entries here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
