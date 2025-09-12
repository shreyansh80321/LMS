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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Sign in to manage your leads efficiently
        </p>
        {err && (
          <div
            className="flex items-center gap-2 text-sm bg-red-50 text-red-600 p-3 rounded-lg mb-4"
            role="alert">
            <AlertCircle size={16} />
            {err}
          </div>
        )}
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative mb-6">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none pr-10"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium transition transform shadow-md flex justify-center items-center gap-2
            ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] text-white"
            }`}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign in"}
        </button>
        <div className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-indigo-600 hover:underline font-medium">
            Create one
          </a>
        </div>
      </form>
    </div>
  );
}
