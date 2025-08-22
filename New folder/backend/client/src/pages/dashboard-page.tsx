import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Redirect to role-specific dashboard
  if (user.role === "management") {
    return <Redirect to="/management" />;
  } else if (user.role === "employee") {
    return <Redirect to="/employee" />;
  } else if (user.role === "trainee") {
    return <Redirect to="/trainee" />;
  }

  return <Redirect to="/auth" />;
}
