import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedRequest } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, Edit, Trash2, Search } from "lucide-react";

export default function Team() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await authenticatedRequest("GET", "/api/users");
      return res.json();
    },
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      const res = await authenticatedRequest("GET", "/api/tasks");
      return res.json();
    },
  });

  const filteredUsers = users.filter((user: any) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserStats = (userId: string) => {
    const userTasks = tasks.filter((task: any) => task.assigneeId === userId);
    const activeTasks = userTasks.filter((task: any) => task.status !== 'done').length;
    const completedTasks = userTasks.filter((task: any) => task.status === 'done').length;
    return { activeTasks, completedTasks };
  };

  const getTeamStats = () => {
    const totalMembers = users.length;
    const scrumMasters = users.filter((user: any) => user.role === 'scrum_master').length;
    const employees = users.filter((user: any) => user.role === 'employee').length;
    return { totalMembers, scrumMasters, employees };
  };

  const teamStats = getTeamStats();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Team</h1>
            <p className="text-muted-foreground">Manage team members, roles, and assignments.</p>
          </div>
          <Button data-testid="button-add-member">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{teamStats.totalMembers}</h3>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{teamStats.scrumMasters}</h3>
                <p className="text-sm text-muted-foreground">Scrum Masters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{teamStats.employees}</h3>
                <p className="text-sm text-muted-foreground">Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Members</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-members"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((member: any) => {
              const stats = getUserStats(member.id);
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {member.firstName} {member.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <Badge
                        variant={member.role === 'scrum_master' ? 'default' : 'secondary'}
                        data-testid={`badge-role-${member.role}`}
                      >
                        {member.role === 'scrum_master' ? 'Scrum Master' : 'Employee'}
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-semibold text-foreground">
                        {stats.activeTasks}
                      </div>
                      <div className="text-xs text-muted-foreground">Active Tasks</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-semibold text-accent">
                        {stats.completedTasks}
                      </div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" data-testid={`button-edit-${member.id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid={`button-delete-${member.id}`}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? (
                  <>
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No members found matching "{searchQuery}"</p>
                  </>
                ) : (
                  <>
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No team members yet</p>
                    <p className="text-sm">Add members to start collaborating</p>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
