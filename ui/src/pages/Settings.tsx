import { Cpu, Database, SettingsIcon, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";

const Settings = () => {
  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-sm text-muted-foreground">Configure AI thresholds and system parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Cpu className="h-4 w-4 text-primary" /> AI Thresholds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between"><Label className="text-sm">Detection Confidence</Label><span className="text-sm font-mono text-primary">75%</span></div>
              <Slider defaultValue={[75]} max={100} step={5} />
              <p className="text-xs text-muted-foreground">Minimum confidence score for product detection</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><Label className="text-sm">Suspicious Behavior Threshold</Label><span className="text-sm font-mono text-primary">60%</span></div>
              <Slider defaultValue={[60]} max={100} step={5} />
              <p className="text-xs text-muted-foreground">Sensitivity for triggering suspicious behavior alerts</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><Label className="text-sm">Loitering Time (seconds)</Label><span className="text-sm font-mono text-primary">120</span></div>
              <Slider defaultValue={[120]} max={300} step={10} />
              <p className="text-xs text-muted-foreground">Time before loitering alert triggers</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Database className="h-4 w-4 text-primary" /> System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse-glow" />
                <span className="text-sm">Redis Cache</span>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse-glow" />
                <span className="text-sm">Database</span>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse-glow" />
                <span className="text-sm">AI Model Server</span>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">Running</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                <span className="text-sm">WebSocket Server</span>
              </div>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px]">Degraded</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Feature Toggles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Real-time Detection", desc: "Enable AI product detection", defaultOn: true },
              { label: "Behavior Analysis", desc: "Track suspicious movement patterns", defaultOn: true },
              { label: "Auto Cart Sync", desc: "Automatically sync detected products to cart", defaultOn: false },
              { label: "Email Notifications", desc: "Send alert notifications via email", defaultOn: true },
              { label: "Debug Mode", desc: "Show detection bounding boxes in stream", defaultOn: false },
            ].map((toggle) => (
              <div key={toggle.label} className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">{toggle.label}</Label>
                  <p className="text-xs text-muted-foreground">{toggle.desc}</p>
                </div>
                <Switch defaultChecked={toggle.defaultOn} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><SettingsIcon className="h-4 w-4 text-primary" /> Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-xs">
              {[
                { time: "11:45:23", msg: "[INFO] Detection model loaded successfully", type: "info" },
                { time: "11:44:12", msg: "[WARN] Redis memory usage at 78%", type: "warn" },
                { time: "11:43:01", msg: "[INFO] Camera cam3 reconnection attempt", type: "info" },
                { time: "11:42:55", msg: "[ERROR] WebSocket connection dropped - retrying", type: "error" },
                { time: "11:40:33", msg: "[INFO] Batch product sync completed", type: "info" },
                { time: "11:38:12", msg: "[INFO] Alert notification sent to admin", type: "info" },
              ].map((log, i) => (
                <div key={i} className="flex gap-3 py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-muted-foreground shrink-0">{log.time}</span>
                  <span className={log.type === "error" ? "text-destructive" : log.type === "warn" ? "text-warning" : "text-muted-foreground"}>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

}

export default Settings
