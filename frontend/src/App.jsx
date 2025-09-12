import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import API from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LeadsList from "./pages/LeadsList";
import LeadForm from "./pages/LeadForm";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/auth/me", { withCredentials: true })
      .then((r) => {
        setUser(r.data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} /> 
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/leads"
        element={
          <PrivateRoute>
            <LeadsList />
          </PrivateRoute>
        }
      />
      <Route
        path="/leads/new"
        element={
          <PrivateRoute>
            <LeadForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/leads/:id"
        element={
          <PrivateRoute>
            <LeadForm />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/leads" replace />} />
    </Routes>
  );
}
