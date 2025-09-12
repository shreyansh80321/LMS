import React from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const nav = useNavigate();

  async function handleLogout() {
    try {
      // Call backend logout endpoint (clears cookie)
      await API.post("/auth/logout");

      // Redirect to login page
      nav("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
}
