"use client";

import { useMyProfile } from "@/hooks/customHooks/useUser";


export default function ProfilePage() {
  const { data, isLoading, isError } = useMyProfile();

  if (isLoading) return <p className="p-6">Loading profile...</p>;
  if (isError) return <p className="p-6 text-red-600">Failed to load profile</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="space-y-2 text-sm">
        <p><b>Name:</b> {data.name}</p>
        <p><b>Email:</b> {data.email}</p>
        <p><b>Role:</b> {data.role}</p>
        <p><b>Address:</b> {data.address}</p>
      </div>
    </div>
  );
}
