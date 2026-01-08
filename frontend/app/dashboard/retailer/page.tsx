"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRetailerProduces } from "@/hooks/customHooks/useRetailerProducts";
import { useRunningBids } from "@/hooks/customHooks/useRunningBids";
import { usePlaceBid } from "@/hooks/customHooks/usePlaceBid";
import { useWonBids } from "@/hooks/customHooks/useWonBids";
import { useFarmerForWonBid } from "@/hooks/customHooks/useFarmerForWonBid";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, User, Package, TrendingUp, Clock, DollarSign, Award, MapPin, Mail, Gavel, Trophy, Zap, CheckCircle } from "lucide-react";
import { toastSuccess } from "@/utils/toast";

export default function RetailerDashboard() {
  const router = useRouter();

  const {
    data: producesData,
    isLoading: producesLoading,
    isError: producesError,
  } = useRetailerProduces();

  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const { data: farmer } = useFarmerForWonBid(selectedBidId);
  const { data: wonBidsData, isLoading: wonBidsLoading } = useWonBids();
  const queryClient = useQueryClient();

  const {
    data: runningBidsData,
    isLoading: runningBidsLoading,
    isError: runningBidsError,
  } = useRunningBids();

  const { mutateAsync: placeBid, isPending } = usePlaceBid();

  const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});

  const handleBidChange = (produceId: string, value: string) => {
    setBidAmounts((prev) => ({
      ...prev,
      [produceId]: Number(value),
    }));
  };

  const handlePlaceBid = async (
    produceId: string,
    minBid: number,
    currentBid?: number
  ) => {
    const bidAmount = bidAmounts[produceId];
    if (!bidAmount) return;

    const minimumAllowed = currentBid ? currentBid + 5 : minBid;
    if (bidAmount < minimumAllowed) {
      toastSuccess(`Bid must be at least ₹${minimumAllowed}`);
      return;
    }

    try {
      const response = await placeBid({ produceId, bidAmount });
      toastSuccess(response.message || "Bid placed successfully");
      console.log("Bid success:", response);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to place bid. Please try again.";

      toastSuccess(message);
      console.error("Bid failed:", error);
    }
  };

  const handleLogout = () => {
    queryClient.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.replace("/");
  };

  if (producesLoading || runningBidsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (producesError || runningBidsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-red-600 font-medium">Failed to load dashboard</p>
        </div>
      </div>
    );
  }

  const stats = {
    available: producesData?.data.length || 0,
    running: runningBidsData?.data.length || 0,
    won: wonBidsData?.data.length || 0,
  };

  console.log(wonBidsData?.data)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Retailer Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">Bid on fresh agricultural products</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center gap-2 bg-white border-2 border-blue-200 text-blue-700 px-5 py-2.5 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium"
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

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Available Produces</p>
                <h3 className="text-4xl font-bold">{stats.available}</h3>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Running Bids</p>
                <h3 className="text-4xl font-bold">{stats.running}</h3>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Won Auctions</p>
                <h3 className="text-4xl font-bold">{stats.won}</h3>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* AVAILABLE PRODUCES */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Available Produces</h2>
          </div>

          <div className="grid gap-6">
            {producesData?.data.map((produce) => (
              <div
                key={produce._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2 capitalize">{produce.name}</h3>
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                        {produce.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
                      <p className="text-xs font-semibold text-purple-800 uppercase mb-1">Category</p>
                      <p className="text-lg font-bold text-purple-900">{produce.category}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
                      <p className="text-xs font-semibold text-blue-800 uppercase mb-1">Quantity</p>
                      <p className="text-lg font-bold text-blue-900">{produce.totalQuantityKg} kg</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3">
                      <p className="text-xs font-semibold text-green-800 uppercase mb-1">Price/kg</p>
                      <p className="text-lg font-bold text-green-900">₹{produce.pricePerKg}</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3">
                      <p className="text-xs font-semibold text-orange-800 uppercase mb-1">Min Bid</p>
                      <p className="text-lg font-bold text-orange-900">₹{produce.minBidAmount}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Farmer Details</p>
                    <p className="text-gray-900 font-medium">{produce.farmer.name}</p>
                    <p className="text-sm text-gray-600">{produce.farmer.address}</p>
                  </div>

                  <div className="flex gap-3 items-center">
                    <input
                      type="number"
                      min={produce.minBidAmount}
                      placeholder="Enter your bid amount"
                      value={bidAmounts[produce._id] || ""}
                      onChange={(e) => handleBidChange(produce._id, e.target.value)}
                      className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />

                    <button
                      onClick={() => handlePlaceBid(produce._id, produce.minBidAmount)}
                      disabled={isPending}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold disabled:opacity-50"
                    >
                      <Gavel className="w-5 h-5" />
                      {isPending ? "Bidding..." : "Place First Bid"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {producesData?.data.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No produces available</h3>
                <p className="text-gray-600">Check back later for new listings!</p>
              </div>
            )}
          </div>
        </section>

        {/* RUNNING BIDS */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Running Bids</h2>
          </div>

          <div className="grid gap-6">
            {runningBidsData?.data.map((produce) => {
              const currentBidAmount = produce.currentBid?.bidAmount;

              return (
                <div
                  key={produce._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-orange-200"
                >
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white capitalize">{produce.name}</h3>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white font-bold text-sm">LIVE</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
                        <p className="text-xs font-semibold text-purple-800 uppercase mb-1">Category</p>
                        <p className="text-lg font-bold text-purple-900">{produce.category}</p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
                        <p className="text-xs font-semibold text-blue-800 uppercase mb-1">Quantity</p>
                        <p className="text-lg font-bold text-blue-900">{produce.totalQuantityKg} kg</p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3">
                        <p className="text-xs font-semibold text-orange-800 uppercase mb-1">Min Bid</p>
                        <p className="text-lg font-bold text-orange-900">₹{produce.minBidAmount}</p>
                      </div>

                      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="w-3 h-3 text-red-600" />
                          <p className="text-xs font-semibold text-red-800 uppercase">Ends At</p>
                        </div>
                        <p className="text-sm font-bold text-red-900">
                          {new Date(produce.bidEndTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {currentBidAmount ? (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <p className="text-sm font-semibold text-green-800">Current Highest Bid</p>
                        </div>
                        <p className="text-3xl font-bold text-green-700">₹{currentBidAmount}</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center">
                        <p className="text-gray-500 font-medium">No bids yet - Be the first!</p>
                      </div>
                    )}

                    <div className="flex gap-3 items-center">
                      <input
                        type="number"
                        min={currentBidAmount ? currentBidAmount + 1 : produce.minBidAmount}
                        placeholder="Enter your bid amount"
                        value={bidAmounts[produce._id] || ""}
                        onChange={(e) => handleBidChange(produce._id, e.target.value)}
                        className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                      />

                      <button
                        onClick={() =>
                          handlePlaceBid(
                            produce._id,
                            produce.minBidAmount,
                            currentBidAmount
                          )
                        }
                        disabled={isPending}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold disabled:opacity-50"
                      >
                        <Gavel className="w-5 h-5" />
                        {isPending ? "Bidding..." : "Place Bid"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {runningBidsData?.data.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No running bids</h3>
                <p className="text-gray-600">Active auctions will appear here</p>
              </div>
            )}
          </div>
        </section>

        {/* WON BIDS */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">My Won Bids</h2>
          </div>

          {wonBidsLoading && (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading won bids...</p>
            </div>
          )}

          <div className="grid gap-6">
            {wonBidsData?.data.map((bid: any) => (
              <div
                key={bid._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-green-200"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">{bid.produceId.name}</h3>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
                      <p className="text-xs font-semibold text-purple-800 uppercase mb-1">Category</p>
                      <p className="text-lg font-bold text-purple-900">{bid.produceId.category}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
                      <p className="text-xs font-semibold text-blue-800 uppercase mb-1">Quantity</p>
                      <p className="text-lg font-bold text-blue-900">{bid.produceId.totalQuantityKg} kg</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3">
                      <p className="text-xs font-semibold text-green-800 uppercase mb-1">Price/kg</p>
                      <p className="text-lg font-bold text-green-900">₹{bid.produceId.pricePerKg}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-5 h-5 text-orange-600" />
                      <p className="text-sm font-semibold text-orange-800">Winning Bid Amount</p>
                    </div>
                    <p className="text-3xl font-bold text-orange-700">₹{bid.bidAmount}</p>
                  </div>

                  <button
                    onClick={() => setSelectedBidId(bid._id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    View Farmer Details
                  </button>

                  {selectedBidId === bid._id && farmer && (
                    <div className="mt-4 bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs font-semibold text-gray-600">Name</p>
                          <p className="text-sm font-bold text-gray-900">{farmer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs font-semibold text-gray-600">Email</p>
                          <p className="text-sm font-bold text-gray-900">{farmer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                        <div>
                          <p className="text-xs font-semibold text-gray-600">Address</p>
                          <p className="text-sm font-bold text-gray-900">{farmer.address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {wonBidsData?.data.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No won bids yet</h3>
                <p className="text-gray-600">Your winning auctions will appear here</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}