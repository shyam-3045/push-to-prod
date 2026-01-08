"use client";

import { useParams, useRouter } from "next/navigation";
import { useProduceResult } from "@/hooks/customHooks/useProduceResult";
import { useUser } from "@/hooks/customHooks/useUser";
import { ArrowLeft, Package, DollarSign, TrendingUp, Trophy, User, Mail, MapPin, Shield, CheckCircle, AlertCircle } from "lucide-react";

export default function ProduceResultPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, isError } = useProduceResult(id as string);

  const winnerUserId = data?.winningBid?.retailerId;
  const { data: user } = useUser(winnerUserId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading auction result...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-red-600 font-medium">Failed to load auction result</p>
        </div>
      </div>
    );
  }

  const { produce, winningBid } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Produce Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Produce Header Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{produce.name}</h1>
                    <p className="text-green-100">Auction Results</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Package className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* Produce Details Grid */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <p className="text-xs font-semibold text-blue-800 uppercase">Category</p>
                    </div>
                    <p className="text-xl font-bold text-blue-900">{produce.category}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <p className="text-xs font-semibold text-purple-800 uppercase">Quantity</p>
                    </div>
                    <p className="text-xl font-bold text-purple-900">{produce.totalQuantityKg} kg</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <p className="text-xs font-semibold text-green-800 uppercase">Price/kg</p>
                    </div>
                    <p className="text-xl font-bold text-green-900">₹{produce.pricePerKg}</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                      <p className="text-xs font-semibold text-orange-800 uppercase">Status</p>
                    </div>
                    <p className="text-xl font-bold text-orange-900">{produce.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Winner Details Card */}
            {winningBid ? (
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Winning {user?.role ?? "User"}</h2>
                      <p className="text-yellow-100">Auction Winner Details</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-700 uppercase">Name</p>
                          <p className="text-lg font-bold text-blue-900">{user.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-purple-700 uppercase">Email</p>
                          <p className="text-lg font-bold text-purple-900 truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-green-700 uppercase">Role</p>
                          <p className="text-lg font-bold text-green-900">{user.role}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-orange-700 uppercase">Address</p>
                          <p className="text-lg font-bold text-orange-900">{user.address}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-500 font-medium">Loading user details…</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Bids Received</h3>
                <p className="text-gray-600">No bids were placed for this produce.</p>
              </div>
            )}
          </div>

          {/* Right Column - Bid Summary */}
          <div className="space-y-6">
            {winningBid && (
              <>
                {/* Winning Bid Amount Card */}
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold">Winning Bid</h3>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <p className="text-yellow-100 text-sm font-medium mb-2">Final Amount</p>
                    <p className="text-5xl font-black">₹{winningBid.bidAmount}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-3xl shadow-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Auction Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-600">Total Value</span>
                      <span className="text-lg font-bold text-gray-900">₹{(produce.totalQuantityKg * produce.pricePerKg).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-600">Bid Amount</span>
                      <span className="text-lg font-bold text-green-600">₹{winningBid.bidAmount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                      <span className="text-sm font-medium text-green-700">Status</span>
                      <span className="text-sm font-bold text-green-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        COMPLETED
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
  
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}