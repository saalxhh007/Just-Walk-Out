import { Button } from '../components/ui/button';
import { Edit, Plus, ShieldCheck, UserX } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import type { UserRole } from '../context/authContext';
import { useState } from 'react';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  createdAt: string;
}

const mockStaff: StaffUser[] = [
  { id: "u1", name: "Youssef Amrani", email: "manager@onlypassby.com", role: "manager", status: "active", createdAt: "2024-01-15" },
  { id: "u2", name: "Fatima Zahra", email: "admin@onlypassby.com", role: "admin", status: "active", createdAt: "2024-01-10" },
  { id: "u3", name: "Omar Benali", email: "cashier@onlypassby.com", role: "cashier", status: "active", createdAt: "2024-02-01" },
  { id: "u4", name: "Amina Khatib", email: "amina@onlypassby.com", role: "cashier", status: "inactive", createdAt: "2024-03-15" },
];

const Users = () => {
    const [users, setUsers] = useState<StaffUser[]>(mockStaff);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "cashier" as UserRole });

  const resetForm = () => { setForm({ name: "", email: "", role: "cashier" }); setEditing(null); };

  const openEdit = (u: StaffUser) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, role: u.role });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setUsers((prev) => prev.map((u) => u.id === editing.id ? { ...u, ...form } : u));
    } else {
      setUsers((prev) => [...prev, { id: `u${Date.now()}`, ...form, status: "active", createdAt: new Date().toISOString().split("T")[0] }]);
    }
    setIsFormOpen(false);
    resetForm();
  };

  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
  };

  const roleColors: Record<string, string> = {
    admin: "bg-destructive/10 text-destructive border-destructive/20",
    manager: "bg-primary/10 text-primary border-primary/20",
    cashier: "bg-success/10 text-success border-success/20",
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage staff accounts and roles</p>
        </div>
        <Button onClick={() => { resetForm(); setIsFormOpen(true); }} className="gradient-primary text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Create User
        </Button>
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-sm">{user.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${roleColors[user.role]}`}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${user.status === "active" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}`}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground font-mono">{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(user)}><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStatus(user.id)}>
                        <UserX className={`h-3.5 w-3.5 ${user.status === "active" ? "text-destructive" : "text-success"}`} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />{editing ? "Edit User" : "Create User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5"><Label className="text-xs">Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <Select value={form.role} onValueChange={(v: UserRole) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button className="flex-1 gradient-primary text-primary-foreground" onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Users
