"use client";

import { useMyProfile } from "@/hooks/customHooks/useUser";
import { User, Mail, Shield, MapPin, ArrowLeft} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data, isLoading, isError } = useMyProfile();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
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
          <p className="text-red-600 font-medium">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white relative">
            <div className="absolute top-6 right-6">
              
            </div>
            
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                <User className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                <p className="text-green-100">View and manage your account details</p>
              </div>
            </div>
          </div>

          {/* Profile Info Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Full Name</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-900">{data.name}</p>
              </div>

              {/* Email Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Email Address</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-purple-900 break-all">{data.email}</p>
              </div>

              {/* Role Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Account Role</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-900 capitalize">{data.role}</p>
              </div>

              {/* Address Card */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Location</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-orange-900">{data.address}</p>
              </div>
            </div>

            {/* Account Stats */}
            <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">✓</p>
                  <p className="text-sm text-gray-600 mt-1">Verified Account</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {data.role === "FARMER" ? "🌾" : "🏢"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{data.role === "FARMER" ? "Farmer" : "Buyer"} Status</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">🔒</p>
                  <p className="text-sm text-gray-600 mt-1">Secure Profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
}