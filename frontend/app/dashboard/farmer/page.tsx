"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useProduces } from "@/hooks/customHooks/useProduces";
import { useCreateProduce } from "@/hooks/customHooks/useCreateProduce";
import { Produce, ProduceForm } from "@/types/produce";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  LogOut,
  User,
  Package,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react";
import { toastFailure } from "@/utils/toast";

export default function FarmerDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useProduces();
  const { mutate: createProduce, isPending } = useCreateProduce();

  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all" | "open" | "closed">("all");

  const [form, setForm] = useState<ProduceForm>({
    name: "",
    category: "FRUIT",
    totalQuantityKg: "",
    pricePerKg: "",
    minBidAmount: "",
    bidDurationMinutes: 5,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (Number(form.totalQuantityKg) < 20) {
      toastFailure("Minumum quantity should be 20 kg");
      return;
    }

    if (Number(form.pricePerKg) > 2000) {
      toastFailure("Maximum price per kg should be 2000");
      return;
    }
    if (Number(form.pricePerKg) < 0) {
      toastFailure("Minimum bid amount should be positive");
      return;
    }

    const name = form.name.trim();

    if (typeof name !== "string" || name.length < 2 || !/[a-zA-Z]/.test(name)) {
      toastFailure("Produce name must contain letters");
      return;
    }

    createProduce(
      {
        name: form.name,
        category: form.category,
        totalQuantityKg: Number(form.totalQuantityKg),
        pricePerKg: Number(form.pricePerKg),
        minBidAmount: Number(form.minBidAmount),
        bidDurationMinutes: form.bidDurationMinutes,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setForm({
            name: "",
            category: "FRUIT",
            totalQuantityKg: "",
            pricePerKg: "",
            minBidAmount: "",
            bidDurationMinutes: 5,
          });
        },
      }
    );
  };

  const handleLogout = () => {
    queryClient.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.replace("/");
  };

  const filteredData = data?.data.filter((produce) => {
    if (activeTab === "all") return true;
    if (activeTab === "open") return produce.status === "OPEN";
    if (activeTab === "closed") return produce.status === "CLOSED";
    return true;
  });

  const stats = {
    total: data?.data.length || 0,
    open: data?.data.filter((p) => p.status === "OPEN").length || 0,
    closed: data?.data.filter((p) => p.status === "CLOSED").length || 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading produces...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-red-600 font-medium">Failed to load produces</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-green-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                My Produces
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your agricultural products
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Produce
              </button>
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center gap-2 bg-white border-2 border-green-200 text-green-700 px-5 py-2.5 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-200 font-medium"
              >
                <User className="w-5 h-5" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">
                  Total Produces
                </p>
                <h3 className="text-4xl font-bold">{stats.total}</h3>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">
                  Open Listings
                </p>
                <h3 className="text-4xl font-bold">{stats.open}</h3>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">
                  Closed Deals
                </p>
                <h3 className="text-4xl font-bold">{stats.closed}</h3>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Produces ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab("open")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === "open"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Open ({stats.open})
            </button>
            <button
              onClick={() => setActiveTab("closed")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === "closed"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Closed ({stats.closed})
            </button>
          </div>
        </div>

        {/* PRODUCE LIST */}
        <div className="grid gap-6">
          {filteredData?.map((produce) => (
            <div
              key={produce._id}
              onClick={() => {
                if (produce.status === "CLOSED") {
                  router.push(`/farmer/produce/${produce._id}`);
                }
              }}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden
                ${
                  produce.status === "CLOSED"
                    ? "cursor-pointer hover:-translate-y-1"
                    : "cursor-default"
                }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {produce.name}
                    </h2>
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                      {produce.category}
                    </span>
                  </div>
                  <span
                    className={`px-4 py-2 text-sm font-bold rounded-xl ${
                      produce.status === "OPEN"
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md"
                        : "bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-md"
                    }`}
                  >
                    {produce.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <p className="text-xs font-semibold text-blue-800 uppercase">
                        Quantity
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {produce.totalQuantityKg} kg
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <p className="text-xs font-semibold text-green-800 uppercase">
                        Price/kg
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      ₹{produce.pricePerKg}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <p className="text-xs font-semibold text-purple-800 uppercase">
                        Min Bid
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">
                      ₹{produce.minBidAmount}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <p className="text-xs font-semibold text-orange-800 uppercase">
                        Duration
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-orange-900">
                      {produce.bidDurationMinutes}m
                    </p>
                  </div>
                </div>
              </div>

              {produce.status === "CLOSED" && (
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 border-t border-purple-200">
                  <p className="text-sm text-purple-800 font-medium text-center">
                    Click to view details →
                  </p>
                </div>
              )}
            </div>
          ))}

          {filteredData?.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No produces found
              </h3>
              <p className="text-gray-600">
                Get started by adding your first produce!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-3xl">
              <h2 className="text-2xl font-bold">Add New Produce</h2>
              <p className="text-green-100 text-sm mt-1">
                Fill in the details to list your produce
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Produce Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., Fresh Tomatoes"
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                >
                  <option value="FRUIT">🍎 Fruit</option>
                  <option value="VEGETABLE">🥬 Vegetable</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    name="totalQuantityKg"
                    value={form.totalQuantityKg}
                    onChange={handleChange}
                    placeholder="100"
                    min={1}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price/kg (₹)
                  </label>
                  <input
                    type="number"
                    name="pricePerKg"
                    value={form.pricePerKg}
                    onChange={handleChange}
                    placeholder="50"
                    min={1}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Produce
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
