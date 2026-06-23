"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Mail, Loader, CheckCircle } from "lucide-react";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const parsed = forgotPasswordSchema.parse({ email });

      // TODO: Implement password reset email sending
      // For now, just show success message
      setSuccess(true);
      setEmail("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message || "Validation error");
      } else {
        setError("Something went wrong. Please try again.");
      }
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
            <div className="relative z-10">
              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
                <p className="mt-2 text-sm text-gray-400">
                  Enter your email to receive password reset instructions
                </p>
              </div>

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-3 rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-300"
                >
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Check your email</p>
                    <p className="text-xs text-green-200/70">
                      We've sent password reset instructions to your inbox
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Alert */}
              {error && !success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {!success ? (
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-cyan-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
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
                        <span>Sending...</span>
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </motion.button>
                </form>
              ) : null}

              {/* Back to Login */}
              <p className="mt-6 text-center text-sm text-gray-400">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition"
                >
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
