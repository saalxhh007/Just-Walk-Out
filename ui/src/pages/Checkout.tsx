import { mockCarts, mockCustomers, type Cart } from '../../data/mockedData';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, Minus, Plus, Printer, Search, Trash2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useState } from 'react';

const Checkout = () => {
  const [search, setSearch] = useState("");
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState(selectedCart?.items || []);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const matchingCustomers = search
    ? mockCustomers.filter((c) =>
        `${c.name}`.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const selectCustomer = (customerId: string) => {
    const cart = mockCarts.find((c) => c.customerId === customerId);
    if (cart) {
      setSelectedCart(cart);
      setCartItems([...cart.items]);
    } else {
      toast.error("No active cart found for this customer");
    }
    setSearch("");
  };

  const updateQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const total = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const handleCheckout = () => {
    setReceiptOpen(true);
    toast.success("Checkout completed successfully!");
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-sm text-muted-foreground">Validate and process customer carts</p>
      </div>

      <Card className="glass-card">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customer by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11"
            />
          </div>
          {matchingCustomers.length > 0 && (
            <div className="mt-2 border border-border rounded-lg overflow-hidden">
              {matchingCustomers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectCustomer(c.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <img src={c.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </div>
                  <Badge variant="outline" className={`ml-auto text-[10px] ${c.status === "in-store" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {c.status}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCart && (
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>{selectedCart.customerName}'s Cart</span>
              <Badge variant="outline" className="text-xs">{cartItems.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <img src={item.product.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">${item.product.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.product.id, -1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.product.id, 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <span className="text-sm font-bold font-mono w-16 text-right">${(item.product.price * item.quantity).toFixed(2)}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(item.product.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}

            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">Total</span>
                <span className="font-bold text-gradient">${total.toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { setSelectedCart(null); setCartItems([]); }}>
                  Cancel
                </Button>
                <Button className="flex-1 gradient-primary text-primary-foreground gap-2" onClick={handleCheckout} disabled={cartItems.length === 0}>
                  <CheckCircle className="h-4 w-4" /> Confirm Checkout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Receipt Dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center border-b border-dashed border-border pb-3">
              <p className="font-bold text-lg">Only Pass By</p>
              <p className="text-xs text-muted-foreground">Smart Store AI</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">{new Date().toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.product.name} ×{item.quantity}</span>
                  <span className="font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-border pt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              <p>Customer: {selectedCart?.customerName}</p>
              <p className="mt-2">Thank you for shopping with us!</p>
            </div>
            <Button variant="outline" className="w-full gap-2" onClick={() => toast.info("Printing receipt...")}>
              <Printer className="h-4 w-4" /> Print Receipt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Checkout
