import { Eye, EyeOff, Scan } from 'lucide-react';
import React, { useState } from 'react'
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-primary-foreground/20"
              style={{
                width: `${60 + i * 40}px`,
                height: `${60 + i * 40}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center">
          <div className="h-20 w-20 rounded-2xl bg-primary-foreground/10 backdrop-blur flex items-center justify-center mx-auto mb-6">
            <Scan className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-3">Only Pass By</h1>
          <p className="text-primary-foreground/70 text-lg max-w-md">
            AI-powered smart store management. Track, analyze, and optimize your store in real-time.
          </p>
          <div className="mt-8 flex gap-6 justify-center text-primary-foreground/60 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-foreground">24/7</div>
              <div>Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-foreground">AI</div>
              <div>Detection</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-foreground">Live</div>
              <div>Analytics</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
              <Scan className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Only Pass By</h1>
              <p className="text-xs text-muted-foreground">Smart Store AI</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-8">Sign in to your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@onlypassby.com"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button type="submit" className="w-full h-11 gradient-primary text-primary-foreground font-semibold" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground font-semibold mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs font-mono text-muted-foreground">
              <p>manager@onlypassby.com / manager123</p>
              <p>admin@onlypassby.com / admin123</p>
              <p>cashier@onlypassby.com / cashier123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login
