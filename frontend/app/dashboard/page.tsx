"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { apiClient } from "@/lib/api";

export default function DashboardPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const handleDashboardAction = async () => {
    if (!user) return;

    try {
      let response;
      switch (user.role) {
        case "FARMER":
          response = await apiClient.getFarmerDashboard();
          alert(response.message);
          break;
        case "RETAILER":
          response = await apiClient.getRetailerDashboard();
          alert(response.message);
          break;
        case "TRANSPORTER":
          response = await apiClient.getTransporterDashboard();
          alert(response.message);
          break;
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error fetching dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const roleDisplay = {
    FARMER: "Farmer",
    RETAILER: "Retailer",
    TRANSPORTER: "Transporter",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user.name || "User"}!
              </h1>
              <p className="text-gray-600 mt-2">
                Role: {roleDisplay[user.role]}
              </p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Dashboard
            </h2>
            <button
              onClick={handleDashboardAction}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Fetch {roleDisplay[user.role]} Dashboard Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}