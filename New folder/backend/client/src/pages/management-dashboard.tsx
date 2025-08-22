import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  FolderOpen, 
  ClipboardCheck, 
  Activity, 
  LogOut,
  Settings,
  Bell
} from "lucide-react";
import { Redirect } from "wouter";

interface ManagementDashboardData {
  totalEmployees: number;
  activeProjects: number;
  pendingApprovals: number;
  recentActivities: Array<{
    id: number;
    action: string;
    timestamp: string;
  }>;
}

export default function ManagementDashboard() {
  const { user, logoutMutation } = useAuth();

  const { data: dashboardData, isLoading } = useQuery<ManagementDashboardData>({
    queryKey: ["/api/dashboard/management"],
    enabled: !!user && user.role === "management",
  });

  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (user.role !== "management") {
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

  return (
    <div className="min-h-screen bg-eil-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b" data-testid="management-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-eil-primary rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">EIL</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Management Dashboard</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" data-testid="stats-cards">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-eil-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-employees">
                {dashboardData?.totalEmployees || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Active workforce
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-eil-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-projects">
                {dashboardData?.activeProjects || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-eil-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-approvals">
                {dashboardData?.pendingApprovals || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card data-testid="recent-activities">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-eil-primary" />
                Recent Activities
              </CardTitle>
              <CardDescription>
                Latest updates and actions in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentActivities?.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{activity.action}</span>
                    <Badge variant="outline">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">No recent activities</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="quick-actions">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used management functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col" data-testid="action-review-approvals">
                  <ClipboardCheck className="h-6 w-6 mb-2" />
                  Review Approvals
                </Button>
                <Button variant="outline" className="h-20 flex-col" data-testid="action-manage-projects">
                  <FolderOpen className="h-6 w-6 mb-2" />
                  Manage Projects
                </Button>
                <Button variant="outline" className="h-20 flex-col" data-testid="action-employee-overview">
                  <Users className="h-6 w-6 mb-2" />
                  Employee Overview
                </Button>
                <Button variant="outline" className="h-20 flex-col" data-testid="action-system-reports">
                  <Activity className="h-6 w-6 mb-2" />
                  System Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
