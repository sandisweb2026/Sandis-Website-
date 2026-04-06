import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Please sign in.");
        setIsSignup(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        navigate("/admin");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 pt-16">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-card p-8">
        <h1 className="text-2xl font-bold text-center text-foreground">
          {isSignup ? "Create Admin Account" : "Admin Login"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-1">Sandis Tours Dashboard</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
          </Button>
        </form>
        <button
          onClick={() => setIsSignup(!isSignup)}
          className="text-sm text-muted-foreground hover:text-primary mt-4 w-full text-center"
        >
          {isSignup ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
