import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
        return;
      }
      navigate("/admin");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 pt-16">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-card p-8">
        <h1 className="text-2xl font-bold text-center text-foreground">Admin Login</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">Sandis Tours Dashboard</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Please wait..." : "Sign In"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Public sign-up is disabled. Create the one admin account in MySQL once, then sign in here.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
