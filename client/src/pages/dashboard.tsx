import { useQuery } from "@tanstack/react-query";
import { authenticatedRequest } from "@/lib/auth";
import MetricCard from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  Users, 
  AlertTriangle,
  Brain,
  Target,
  Percent,
  Rocket,
  Sun
} from "lucide-react";

export default function Dashboard() {
  const { data: metrics } = useQuery({
    queryKey: ["/api/analytics/metrics"],
    queryFn: async () => {
      const res = await authenticatedRequest("GET", "/api/analytics/metrics");
      return res.json();
    },
  });

  const { data: insights } = useQuery({
    queryKey: ["/api/analytics/insights"],
    queryFn: async () => {
      const res = await authenticatedRequest("GET", "/api/analytics/insights");
      return res.json();
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await authenticatedRequest("GET", "/api/projects");
      return res.json();
    },
  });

  const { data: tasks } = useQuery({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      const res = await authenticatedRequest("GET", "/api/tasks");
      return res.json();
    },
  });

  const completedTasks = tasks?.filter((task: any) => task.status === 'done') || [];
  const recentTasks = completedTasks.slice(0, 3);

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your tasks today.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Tasks Completed"
          value={metrics?.completedTasks || 0}
          icon={CheckCircle}
          trend="+12%"
          trendColor="text-accent"
        />
        <MetricCard
          title="Avg Completion Time"
          value={`${metrics?.avgCompletionTime || 0}h`}
          icon={Clock}
          trend="-8%"
          trendColor="text-primary"
        />
        <MetricCard
          title="Team Productivity"
          value={`${metrics?.teamProductivity || 0}%`}
          icon={Users}
          trend="+15%"
          trendColor="text-chart-2"
        />
        <MetricCard
          title="Overdue Tasks"
          value={metrics?.overdueTasks || 0}
          icon={AlertTriangle}
          trend={String(metrics?.overdueTasks || 0)}
          trendColor="text-destructive"
        />
      </div>

      {/* AI Productivity Insights */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            AI Productivity Insights
            <Brain className="h-5 w-5 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">
                {insights?.focusTime || "6.2h"}
              </h4>
              <p className="text-sm text-muted-foreground">Daily Focus Time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Percent className="h-8 w-8 text-accent" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">
                {insights?.completionRate || 87}%
              </h4>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Rocket className="h-8 w-8 text-chart-2" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">
                {insights?.teamVelocity || 23}
              </h4>
              <p className="text-sm text-muted-foreground">Team Velocity</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-chart-4/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sun className="h-8 w-8 text-chart-4" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">
                {insights?.bestWorkHours || "10-12 AM"}
              </h4>
              <p className="text-sm text-muted-foreground">Best Work Hours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Projects and Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Active Projects
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects?.slice(0, 2).map((project: any) => (
                <div 
                  key={project.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(project.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Progress value={project.progress} className="w-20 mb-1" />
                    <span className="text-xs text-muted-foreground">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Tasks
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task: any) => (
                <div 
                  key={task.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded border-2 border-accent bg-accent flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">{task.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {projects?.find((p: any) => p.id === task.projectId)?.name || 'No Project'}
                      </span>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {task.priority} Priority
                      </Badge>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {recentTasks.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No completed tasks yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
