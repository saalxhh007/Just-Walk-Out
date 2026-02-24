import { useAuth, type UserRole } from "./../context/authContext";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  AlertTriangle,
  Camera,
  Settings,
  ShieldCheck,
  Receipt,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "./../components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ["manager", "admin", "cashier"] },
  { title: "Customers", url: "/customers", icon: Users, roles: ["manager"] },
  { title: "Carts", url: "/carts", icon: ShoppingCart, roles: ["manager", "cashier"] },
  { title: "Inventory", url: "/inventory", icon: Package, roles: ["manager"] },
  { title: "Analytics", url: "/analytics", icon: BarChart3, roles: ["manager"] },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle, roles: ["manager", "admin"] },
  { title: "Cameras", url: "/cameras", icon: Camera, roles: ["admin"] },
  { title: "Users", url: "/users", icon: ShieldCheck, roles: ["admin"] },
  { title: "Settings", url: "/settings", icon: Settings, roles: ["admin"] },
  { title: "Checkout", url: "/checkout", icon: Receipt, roles: ["cashier"] },
];

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filteredItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">OP</span>
          </div>
          <div>
            <h1 className="font-semibold text-sm text-sidebar-foreground">Only Pass By</h1>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Smart Store AI</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors">
                        <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
export default AppSidebar