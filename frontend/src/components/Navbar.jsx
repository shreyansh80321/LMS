import React from "react";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <h1 className="text-xl font-bold text-gray-800">My Lead Management System</h1>
      <LogoutButton />
    </nav>
  );
}
