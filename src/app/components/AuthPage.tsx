import { useState } from "react";
import { useNavigate } from "react-router";
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";

export function AuthPage() {
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle, isAuthenticated, authLoading } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all required fields");
      return;
    }

    if (!isLogin && !name) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An error occurred with Google sign-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col">
      {/* Back button */}
      <div className="px-4 pt-3">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-muted-foreground text-[0.875rem]">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        {/* Logo */}
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4">
          <Zap className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-[1.5rem]" style={{ fontWeight: 700 }}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-[0.875rem] text-muted-foreground mt-1">
          {isLogin
            ? "Sign in to continue to PlugPoint"
            : "Join the EV charging community"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm mt-6 space-y-3">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-input-background text-[0.875rem] outline-none focus:border-primary transition-colors"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-input-background text-[0.875rem] outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-border rounded-xl bg-input-background text-[0.875rem] outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {error && (
            <p className="text-[0.75rem] text-destructive text-center">
              {error}
            </p>
          )}

          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-[0.75rem] text-primary">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full py-2.5 bg-primary text-white rounded-xl text-[0.9375rem] disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-sm mt-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[0.75rem] text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social Login */}
        <div className="w-full max-w-sm space-y-2 mt-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading || authLoading}
            className="w-full py-2.5 border border-border rounded-xl text-[0.875rem] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
          <button
            disabled={true}
            className="w-full py-2.5 bg-black text-white rounded-xl text-[0.875rem] flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* Toggle */}
        <p className="text-[0.8125rem] text-muted-foreground mt-5">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-primary"
            style={{ fontWeight: 600 }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
