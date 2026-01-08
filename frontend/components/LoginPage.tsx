"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, User, MapPin, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

import { useLogin } from "@/hooks/customHooks/useLogin";
import { useSignup } from "@/hooks/customHooks/useSignup";

/* ---------------- Schemas ---------------- */

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  address: z.string().min(10),
  role: z.enum(["FARMER", "RETAILER"]),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { mutateAsync: login, isPending: isLoginPending } = useLogin();
  const { mutateAsync: signup, isPending: isSignupPending } = useSignup();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "FARMER" },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      router.push(`/dashboard/${response.user.role.toLowerCase()}`);
    } catch {
      loginForm.setError("password", {
        type: "manual",
        message: "Invalid email or password",
      });
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    const response = await signup(data);
    router.push(`/dashboard/${response.user.role.toLowerCase()}`);
  };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    loginForm.reset();
    signupForm.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-green-600 text-white px-6 py-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "login" ? "Welcome Back 👋" : "Create Your Account 🌱"}
          </h1>
          <p className="text-sm text-green-100 mt-1">
            {mode === "login"
              ? "Login to continue to your dashboard"
              : "Join the farm-to-market ecosystem"}
          </p>
        </div>

        {/* MODE TOGGLE */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => switchMode("login")}
            className={`flex-1 py-3 text-sm font-medium transition ${
              mode === "login"
                ? "border-b-2 border-green-600 text-green-600 bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => switchMode("signup")}
            className={`flex-1 py-3 text-sm font-medium transition ${
              mode === "signup"
                ? "border-b-2 border-green-600 text-green-600 bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Signup
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === "login" && (
          <div className="p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  {...loginForm.register("email")}
                  className="w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="you@example.com"
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...loginForm.register("password")}
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-xs text-orange-600 mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              onClick={loginForm.handleSubmit(onLoginSubmit)}
              disabled={isLoginPending}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60"
            >
              {isLoginPending ? "Logging in..." : "Login"}
            </button>
          </div>
        )}

        {/* SIGNUP FORM */}
        {mode === "signup" && (
          <div className="p-6 space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                {...signupForm.register("name")}
                placeholder="Full Name"
                className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                {...signupForm.register("email")}
                placeholder="Email"
                className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                {...signupForm.register("password")}
                placeholder="Password"
                className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                {...signupForm.register("address")}
                placeholder="Address"
                className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <select
                {...signupForm.register("role")}
                className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="FARMER">Farmer</option>
                <option value="RETAILER">Retailer</option>
              </select>
            </div>

            <button
              onClick={signupForm.handleSubmit(handleSignup)}
              disabled={isSignupPending}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60"
            >
              {isSignupPending ? "Creating account..." : "Create Account"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
