import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockAlerts, type Alert } from '../../data/mockedData';
import { useState } from 'react';
import { AlertTriangle, FileVideoCameraIcon, Filter, Package } from 'lucide-react';

type AlertFilter = "all" | "suspicious" | "misplaced" | "camera-offline";

const filterOptions: { value: AlertFilter; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "all", label: "All", icon: Filter },
  { value: "suspicious", label: "Suspicious", icon: AlertTriangle },
  { value: "misplaced", label: "Misplaced", icon: Package },
  { value: "camera-offline", label: "Camera", icon: FileVideoCameraIcon },
];

const Alerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<AlertFilter>("all");

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.type === filter);

  const markRead = (id: string) => setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));

  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    suspicious: AlertTriangle,
    misplaced: Package,
    "camera-offline": FileVideoCameraIcon,
  };

  const severityColors: Record<string, string> = {
    high: "bg-destructive/10 text-destructive border-destructive/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    low: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Alerts</h1>
        <p className="text-sm text-muted-foreground">Monitor store alerts and notifications</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((opt) => (
          <Button
            key={opt.value}
            variant={filter === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(opt.value)}
            className={`gap-1.5 ${filter === opt.value ? "gradient-primary text-primary-foreground" : ""}`}
          >
            <opt.icon className="h-3.5 w-3.5" />
            {opt.label}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((alert) => {
          const Icon = typeIcons[alert.type] || AlertTriangle;
          return (
            <Card key={alert.id} className={`glass-card transition-all ${!alert.read ? "border-destructive/30" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${alert.severity === "high" ? "bg-destructive/10" : alert.severity === "medium" ? "bg-warning/10" : "bg-muted"}`}>
                    <Icon className={`h-5 w-5 ${alert.severity === "high" ? "text-destructive" : alert.severity === "medium" ? "text-warning" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-[10px] ${severityColors[alert.severity]}`}>{alert.severity}</Badge>
                      <Badge variant="outline" className="text-[10px]">{alert.type}</Badge>
                      {!alert.read && <span className="h-2 w-2 rounded-full bg-destructive animate-pulse-glow" />}
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{alert.timestamp}</p>
                  </div>
                  {!alert.read && (
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => markRead(alert.id)}>
                      Mark read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Alerts
