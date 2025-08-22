import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Activity, 
  LogOut,
  Settings,
  Bell,
  Calendar
} from "lucide-react";
import { Redirect } from "wouter";

interface EmployeeDashboardData {
  assignedTasks: number;
  completedTasks: number;
  upcomingDeadlines: number;
  recentUpdates: Array<{
    id: number;
    title: string;
    date: string;
  }>;
}

export default function EmployeeDashboard() {
  const { user, logoutMutation } = useAuth();

  const { data: dashboardData, isLoading } = useQuery<EmployeeDashboardData>({
    queryKey: ["/api/dashboard/employee"],
    enabled: !!user && user.role === "employee",
  });

  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (user.role !== "employee") {
    return <Redirect to="/" />;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-eil-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-eil-primary"></div>
      </div>
    );
  }

  const completionRate = dashboardData ? 
    Math.round((dashboardData.completedTasks / (dashboardData.completedTasks + dashboardData.assignedTasks)) * 100) : 0;

  return (
    <div className="min-h-screen bg-eil-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b" data-testid="employee-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-eil-primary rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">EIL</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.firstName} {user.lastName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" data-testid="button-notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" data-testid="button-settings">
                <Settings className="h-4 w-4" />
              </Button>
              <Avatar data-testid="avatar-user">
                <AvatarFallback className="bg-eil-primary text-white">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-testid="stats-cards">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-eil-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-assigned">
                {dashboardData?.assignedTasks || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Active assignments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-completed">
                {dashboardData?.completedTasks || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-deadlines">
                {dashboardData?.upcomingDeadlines || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Next 7 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <AlertCircle className="h-4 w-4 text-eil-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-completion">
                {completionRate}%
              </div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Updates */}
          <Card data-testid="recent-updates">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-eil-primary" />
                Recent Updates
              </CardTitle>
              <CardDescription>
                Latest notifications and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentUpdates?.map((update) => (
                  <div key={update.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{update.title}</span>
                    <Badge variant="outline">
                      {new Date(update.date).toLocaleDateString()}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">No recent updates</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card data-testid="quick-actions">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used employee functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col" data-testid="action-view-tasks">
                  <CheckSquare className="h-6 w-6 mb-2" />
                  View Tasks
                </Button>
                <Button variant="outline" className="h-20 flex-col" data-testid="action-time-tracker">
                  <Clock className="h-6 w-6 mb-2" />
                  Time Tracker
                </Button>
                <Button variant="outline" className="h-20 flex-col" data-testid="action-schedule">
                  <Calendar className="h-6 w-6 mb-2" />
                  Schedule
                </Button>
                <Button variant="outline" className="h-20 flex-col" data-testid="action-reports">
                  <Activity className="h-6 w-6 mb-2" />
                  Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
