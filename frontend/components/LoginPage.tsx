"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, User, MapPin, Briefcase } from "lucide-react";

import { useLogin } from "@/hooks/customHooks/useLogin";
import { useSignup } from "@/hooks/customHooks/useSignup";
import { useRouter } from "next/navigation";


const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  address: z.string().min(10),
  role: z.enum(["FARMER", "RETAILER", "TRANSPORTER"]),
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


  const onLoginSubmit = async(data: LoginFormData) => {
    const response =await login(data);
    console.log("Login  response:", response);
    router.push(`/dashboard/${response.user.role.toLowerCase()}`);
  };

  const handleSignup = async (data: SignupFormData) => {
  const response = await signup(data);
  console.log("Signup response:", response);
  router.push(`/dashboard/${response.user.role.toLowerCase()}`);
};


  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    loginForm.reset();
    signupForm.reset();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-green-100">
              {mode === "login" 
                ? "Sign in to access your account" 
                : "Create your account to get started"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => switchMode("login")}
              className={`flex-1 py-4 text-center font-semibold transition-all ${
                mode === "login"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchMode("signup")}
              className={`flex-1 py-4 text-center font-semibold transition-all ${
                mode === "signup"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Signup
            </button>
          </div>

          {mode === "login" && (
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...loginForm.register("email")}
                      placeholder="john@example.com"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {loginForm.formState.errors.email?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...loginForm.register("password")}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {loginForm.formState.errors.password?.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">                  
                </div>

                <button
                  onClick={loginForm.handleSubmit(onLoginSubmit)}
                  disabled={isLoginPending}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoginPending ? "Logging in..." : "Login"}
                </button>
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div className="p-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...signupForm.register("name")}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  {signupForm.formState.errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {signupForm.formState.errors.name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...signupForm.register("email")}
                      placeholder="john@example.com"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      {...signupForm.register("password")}
                      placeholder="Create a password"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      {...signupForm.register("address")}
                      placeholder="123 Main Street, Downtown"
                      rows={3}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <select
                      {...signupForm.register("role")}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer"
                    >
                      <option value="FARMER">Farmer</option>
                      <option value="RETAILER">Retailer</option>
                      <option value="TRANSPORTER">Transporter</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={signupForm.handleSubmit(handleSignup)}
                  disabled={isSignupPending}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSignupPending ? "Creating account..." : "Create Account"}
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-8 pb-8 text-center text-sm text-gray-600">
            {mode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => switchMode("signup")}
                  className="text-green-600 hover:text-green-700 font-semibold transition"
                >
                  Sign up now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="text-green-600 hover:text-green-700 font-semibold transition"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-gray-600 mt-6">
          By continuing, you agree to our{" "}
          <a href="#" className="text-green-600 hover:text-green-700 font-medium transition">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-green-600 hover:text-green-700 font-medium transition">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}