import { Button } from '../components/ui/button';
import { Edit, Eye, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useState } from 'react';
import type { Customer } from '../../data/mockedData';
import { mockCustomers } from '../../data/mockedData';

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [search, setSearch] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", image: "",
  });

  const filtered = customers.filter(
    (c) =>
      `${c.name}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", image: "" });
    setEditingCustomer(null);
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setForm({ name: c.name, email: c.email, phone: c.phone, image: c.image });
    setIsFormOpen(true);
  };

  const openAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const statusColors: Record<string, string> = {
    "in-store": "bg-success/10 text-success border-success/20",
    "checked-out": "bg-muted text-muted-foreground",
    idle: "bg-warning/10 text-warning border-warning/20",
  };

  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...form } : c))
      );
    } else {
      const newCustomer: Customer = {
        id: `c${Date.now()}`,
        ...form,
        entryTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "idle",
      };
      setCustomers((prev) => [...prev, newCustomer]);
    }
    setIsFormOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">Manage and track store customers</p>
        </div>
        <Button onClick={openAdd} className="gradient-primary text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Badge variant="outline" className="text-xs">{filtered.length} customers</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Entry</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={customer.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                      <span className="font-medium text-sm">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{customer.email}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground font-mono">{customer.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${statusColors[customer.status]}`}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground font-mono">{customer.entryTime}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewCustomer(customer)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(customer)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(customer.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "Edit Customer" : "Add Customer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button className="flex-1 gradient-primary text-primary-foreground" onClick={handleSave}>
                {editingCustomer ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewCustomer} onOpenChange={() => setViewCustomer(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewCustomer && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={viewCustomer.image} alt="" className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{viewCustomer.name}</p>
                  <Badge variant="outline" className={`text-[10px] ${statusColors[viewCustomer.status]}`}>
                    {viewCustomer.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{viewCustomer.email}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-mono">{viewCustomer.phone}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Entry Time</span><span className="font-mono">{viewCustomer.entryTime}</span></div>
                {viewCustomer.currentCart && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cart</span>
                    <Badge variant="outline" className="gap-1"><ShoppingCart className="h-3 w-3" />{viewCustomer.currentCart}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Customers
