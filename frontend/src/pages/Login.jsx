import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("test@demo.com");
  const [password, setPassword] = useState("TestPass123");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await API.post("/auth/login", { email, password });
      nav("/leads");
    } catch (error) {
      setErr(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-lg bg-white backdrop-blur-sm bg-opacity-80 border border-gray-200 shadow-2xl rounded-3xl p-10"
      >
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2 text-center">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-500 text-md mb-8">
          Sign in to your account and manage your leads effortlessly
        </p>

        {err && (
          <div
            className="flex items-center gap-2 text-sm bg-red-50 text-red-600 p-3 rounded-xl mb-4 shadow-sm animate-pulse"
            role="alert"
          >
            <AlertCircle size={18} />
            {err}
          </div>
        )}

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full p-4 mb-5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all duration-300 shadow-sm"
          required
        />

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none pr-12 transition-all duration-300 shadow-sm"
            required
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-500 transition"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOff
                size={20}
                className="text-gray-500 hover:text-indigo-500 transition -mt-2"
              />
            ) : (
              <Eye
                size={20}
                className="text-gray-500 hover:text-indigo-500 transition -mt-2"
              />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-semibold text-white flex justify-center items-center gap-3 transition-all duration-300 shadow-lg overflow-hidden relative ${
            loading
              ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-[1.03] hover:shadow-2xl"
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2 animate-pulse">
              <Loader2 className="animate-spin" size={20} />
              <span>Signing In...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-indigo-600 hover:text-purple-600 font-medium transition"
          >
            Create one
          </a>
        </div>
      </form>
    </div>
  );
}
