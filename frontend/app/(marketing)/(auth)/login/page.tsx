"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Mail, Lock, LogIn, Loader } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setCallbackUrl(params.get("callbackUrl") || "/dashboard");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const parsed = loginSchema.parse(formData);

      const result = await signIn("credentials", {
        email: parsed.email,
        password: parsed.password,
        redirect: false,
      });

      if (!result?.ok) {
        const errorMessage = result?.error || "Invalid credentials";
        const normalizedError = errorMessage.toLowerCase();

        if (/(database|network|connect|timeout|fetch|request)/.test(normalizedError)) {
          setError("No network");
        } else if (errorMessage === "CredentialsSignin" || errorMessage === "SignIn") {
          setError("Invalid credentials");
        } else {
          setError("Invalid credentials");
        }
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message || "Validation error");
      } else {
        setError("No network");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061018] text-white">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 backdrop-blur-xl">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition" />

            <div className="relative z-10">
              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
                <p className="mt-2 text-sm text-gray-400">
                  Sign in to your ERP account
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-cyan-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-cyan-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  type="submit"
                  className="relative w-full overflow-hidden rounded-lg border border-cyan-500/30 bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-3 font-medium text-white transition hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 border-t border-white/10" />
                <span className="text-xs text-gray-500">Or continue with</span>
                <div className="flex-1 border-t border-white/10" />
              </div>

              {/* Google OAuth */}
              <motion.button
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
                onClick={handleGoogleSignIn}
                type="button"
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn className="h-4 w-4" />
                <span>Google</span>
              </motion.button>

              {/* Sign Up Link */}
              <p className="mt-6 text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
