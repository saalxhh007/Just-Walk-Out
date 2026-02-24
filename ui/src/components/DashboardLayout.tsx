import { useAuth } from "./../context/authContext";
import { Navigate, Outlet } from "react-router-dom";
import { AppSidebar } from "./../components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "./../components/ui/sidebar";
import { Bell, LogOut } from "lucide-react";
import { Button } from "./../components/ui/button";
import { Badge } from "./../components/ui/badge";
import { mockAlerts } from "./../../data/mockedData.ts";

export default function DashboardLayout() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const unreadAlerts = mockAlerts.filter((a) => !a.read).length;

  const roleBadgeClass =
    user?.role === "admin"
      ? "bg-destructive/10 text-destructive border-destructive/20"
      : user?.role === "manager"
      ? "bg-primary/10 text-primary border-primary/20"
      : "bg-success/10 text-success border-success/20";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm font-medium">{user?.name}</span>
                <Badge variant="outline" className={`text-[10px] font-mono uppercase ${roleBadgeClass}`}>
                  {user?.role}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Bell className="h-4 w-4" />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
                    {unreadAlerts}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          {/* Page Content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
