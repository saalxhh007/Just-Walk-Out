import { Card, CardContent } from '../components/ui/card';
import { Minus, Plus, ShoppingCart, Trash2, User } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useState } from 'react';
import { mockCarts, mockProducts, type Cart } from '../../data/mockedData.ts';

const Carts = () => {
  const [carts, setCarts] = useState<Cart[]>(mockCarts);
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleRemoveItem = (cartId: string, productId: string) => {
    setCarts((prev) =>
      prev.map((c) => {
        if (c.id !== cartId) return c;
        const items = c.items.filter((i) => i.product.id !== productId);
        return { ...c, items, total: items.reduce((s, i) => s + i.product.price * i.quantity, 0) };
      })
    );
    if (selectedCart?.id === cartId) {
      setSelectedCart((prev) => {
        if (!prev) return prev;
        const items = prev.items.filter((i) => i.product.id !== productId);
        return { ...prev, items, total: items.reduce((s, i) => s + i.product.price * i.quantity, 0) };
      });
    }
  };

  const handleQuantity = (cartId: string, productId: string, delta: number) => {
    const updateCart = (c: Cart): Cart => {
      if (c.id !== cartId) return c;
      const items = c.items.map((i) =>
        i.product.id === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      );
      return { ...c, items, total: items.reduce((s, i) => s + i.product.price * i.quantity, 0) };
    };
    setCarts((prev) => prev.map(updateCart));
    if (selectedCart?.id === cartId) setSelectedCart((prev) => (prev ? updateCart(prev) : prev));
  };

  const handleAddProduct = () => {
    if (!selectedCart || !selectedProduct) return;
    const product = mockProducts.find((p) => p.id === selectedProduct);
    if (!product) return;
    const updateCart = (c: Cart): Cart => {
      if (c.id !== selectedCart.id) return c;
      const existing = c.items.find((i) => i.product.id === product.id);
      const items = existing
        ? c.items.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...c.items, { product, quantity: 1 }];
      return { ...c, items, total: items.reduce((s, i) => s + i.product.price * i.quantity, 0) };
    };
    setCarts((prev) => prev.map(updateCart));
    setSelectedCart((prev) => (prev ? updateCart(prev) : prev));
    setAddProductOpen(false);
    setSelectedProduct("");
  };

  const statusColors: Record<string, string> = {
    active: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    completed: "bg-muted text-muted-foreground",
  };
  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Cart Monitor</h1>
        <p className="text-sm text-muted-foreground">Track active customer carts in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {carts.map((cart) => (
          <Card
            key={cart.id}
            className={`glass-card cursor-pointer transition-all hover:glow-primary ${selectedCart?.id === cart.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedCart(cart)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{cart.customerName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{cart.id}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`text-[10px] ${statusColors[cart.status]}`}>
                  {cart.status}
                </Badge>
              </div>
              <div className="space-y-2">
                {cart.items.slice(0, 3).map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <img src={item.product.image} alt="" className="h-6 w-6 rounded object-cover" />
                      <span className="truncate">{item.product.name}</span>
                    </div>
                    <span className="text-muted-foreground font-mono">×{item.quantity}</span>
                  </div>
                ))}
                {cart.items.length > 3 && (
                  <p className="text-xs text-muted-foreground">+{cart.items.length - 3} more items</p>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{cart.items.length} items</span>
                <span className="font-bold text-sm">${cart.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cart Detail Dialog */}
      <Dialog open={!!selectedCart} onOpenChange={() => setSelectedCart(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {selectedCart?.customerName}'s Cart
            </DialogTitle>
          </DialogHeader>
          {selectedCart && (
            <div className="space-y-4">
              <div className="space-y-2">
                {selectedCart.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <img src={item.product.image} alt="" className="h-10 w-10 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">${item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantity(selectedCart.id, item.product.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantity(selectedCart.id, item.product.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveItem(selectedCart.id, item.product.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => setAddProductOpen(true)} className="gap-1">
                  <Plus className="h-3 w-3" /> Add Product
                </Button>
                <p className="text-lg font-bold">${selectedCart.total.toFixed(2)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Product to Cart */}
      <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Product to Cart</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger><SelectValue placeholder="Select a product" /></SelectTrigger>
              <SelectContent>
                {mockProducts.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name} - ${p.price.toFixed(2)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="w-full gradient-primary text-primary-foreground" onClick={handleAddProduct} disabled={!selectedProduct}>
              Add to Cart
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Carts
