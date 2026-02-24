import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Edit, Eye, Play, Plus, Trash2, VideoIcon, WifiOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useState } from 'react';
import { mockCameras, type Camera } from '../../data/mockedData';
import { toast } from 'sonner';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const Cameras = () => {

  const [cameras, setCameras] = useState<Camera[]>(mockCameras);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Camera | null>(null);
  const [viewCam, setViewCam] = useState<Camera | null>(null);
  const [form, setForm] = useState({ name: "", location: "", zone: "", streamUrl: "" });

  const resetForm = () => { setForm({ name: "", location: "", zone: "", streamUrl: "" }); setEditing(null); };

  const openEdit = (c: Camera) => {
    setEditing(c);
    setForm({ name: c.name, location: c.location, zone: c.zone, streamUrl: c.streamUrl });
    setIsFormOpen(true);
  };

  const openAdd = () => { resetForm(); setIsFormOpen(true); };

  const handleSave = () => {
    if (editing) {
      setCameras((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      setCameras((prev) => [...prev, { id: `cam${Date.now()}`, ...form, status: "offline", lastChecked: "Just now" }]);
    }
    setIsFormOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => setCameras((prev) => prev.filter((c) => c.id !== id));

  const testConnection = (cam: Camera) => {
    toast.info(`Testing connection to ${cam.name}...`);
    setTimeout(() => {
      if (cam.status === "online") {
        toast.success(`${cam.name} is responding correctly`);
      } else {
        toast.error(`${cam.name} is not responding`);
      }
    }, 1500);
  };
  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cameras</h1>
          <p className="text-sm text-muted-foreground">Manage store surveillance cameras</p>
        </div>
        <Button onClick={openAdd} className="gradient-primary text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add Camera
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cameras.map((cam) => (
          <Card key={cam.id} className="glass-card">
            <CardContent className="p-5">
              <div className="h-36 rounded-lg bg-muted/30 border border-border flex items-center justify-center mb-4 relative overflow-hidden">
                {cam.status === "online" ? (
                  <>
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
                    <div className="text-center">
                      <VideoIcon className="h-8 w-8 text-primary mb-2 mx-auto" />
                      <p className="text-xs text-muted-foreground">Live Feed</p>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
                      <span className="text-[10px] text-success font-mono">LIVE</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <WifiOff className="h-8 w-8 text-muted-foreground mb-2 mx-auto" />
                    <p className="text-xs text-muted-foreground">Offline</p>
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-sm">{cam.name}</p>
                  <p className="text-xs text-muted-foreground">{cam.location} · {cam.zone}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] ${cam.status === "online" ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                  {cam.status}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground font-mono mb-3 truncate">{cam.streamUrl}</p>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setViewCam(cam)}>
                  <Eye className="h-3 w-3" /> View
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => testConnection(cam)}>
                  <Play className="h-3 w-3" /> Test
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cam)}><Edit className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(cam.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><VideoIcon className="h-5 w-5" />{editing ? "Edit Camera" : "Add Camera"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5"><Label className="text-xs">Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Entrance Main" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Zone</Label><Input value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Stream URL</Label><Input value={form.streamUrl} onChange={(e) => setForm({ ...form, streamUrl: e.target.value })} placeholder="rtsp://..." /></div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button className="flex-1 gradient-primary text-primary-foreground" onClick={handleSave}>{editing ? "Update" : "Add"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewCam} onOpenChange={() => setViewCam(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewCam?.name}</DialogTitle>
          </DialogHeader>
          {viewCam && (
            <div className="space-y-4">
              <div className="h-64 rounded-lg bg-muted/30 border border-border flex items-center justify-center">
                <div className="text-center">
                  <VideoIcon className="h-12 w-12 text-primary mb-3 mx-auto" />
                  <p className="text-sm text-muted-foreground">Camera stream preview</p>
                  <p className="text-xs font-mono text-muted-foreground mt-1">{viewCam.streamUrl}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Location:</span> {viewCam.location}</div>
                <div><span className="text-muted-foreground">Zone:</span> {viewCam.zone}</div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={`text-[10px] ${viewCam.status === "online" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{viewCam.status}</Badge></div>
                <div><span className="text-muted-foreground">Last checked:</span> {viewCam.lastChecked}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Cameras
