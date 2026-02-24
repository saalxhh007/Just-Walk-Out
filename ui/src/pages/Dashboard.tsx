import { useAuth } from "./../context/authContext.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./../components/ui/card.tsx";
import { Badge } from "./../components/ui/badge.tsx";
import { Users, ShoppingCart, DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { mockActivity, mockAlerts, mockCarts, mockCustomers } from "./../../data/mockedData.ts";

const statCards = [
  {
    title: "Customers In Store",
    value: mockCustomers.filter((c) => c.status === "in-store").length,
    change: "+12%",
    up: true,
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Today's Sales",
    value: "$2,847",
    change: "+8.2%",
    up: true,
    icon: DollarSign,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    title: "Active Carts",
    value: mockCarts.filter((c) => c.status === "active").length,
    change: "-3%",
    up: false,
    icon: ShoppingCart,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    title: "Active Alerts",
    value: mockAlerts.filter((a) => !a.read).length,
    change: "+2",
    up: true,
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

const eventTypeColors: Record<string, string> = {
  pick: "bg-primary/10 text-primary",
  return: "bg-warning/10 text-warning",
  enter: "bg-success/10 text-success",
  exit: "bg-muted text-muted-foreground",
  alert: "bg-destructive/10 text-destructive",
};

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, <span className="text-gradient">{user?.name.split(" ")[0]}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening in your store today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="glass-card hover:glow-primary transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {stat.up ? (
                  <ArrowUpRight className="h-3 w-3 text-success" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <span className={`text-xs font-medium ${stat.up ? "text-success" : "text-destructive"}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last hour</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Live Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockActivity.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 h-2 w-2 rounded-full ${event.type === "alert" ? "bg-destructive animate-pulse-glow" : "bg-primary"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{event.message}</p>
                    <p className="text-xs text-muted-foreground font-mono">{event.timestamp}</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${eventTypeColors[event.type]}`}>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${!alert.read ? "bg-destructive/5 border-destructive/20" : "border-border"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            alert.severity === "high"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : alert.severity === "medium"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">{alert.type}</Badge>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
