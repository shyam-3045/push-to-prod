"use client";

import { useParams, useRouter } from "next/navigation";
import { useProduceResult } from "@/hooks/customHooks/useProduceResult";
import { useUser } from "@/hooks/customHooks/useUser";

export default function ProduceResultPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, isError } = useProduceResult(id as string);

  const winnerUserId = data?.winningBid?.retailerId;
  const { data: user } = useUser(winnerUserId);

  if (isLoading) {
    return <div className="p-6">Loading auction result...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load auction result</div>;
  }

  const { produce, winningBid } = data;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{produce.name}</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* PRODUCE DETAILS */}
      <div className="text-sm text-gray-700 space-y-1 mb-6">
        <p><b>Category:</b> {produce.category}</p>
        <p><b>Total Quantity:</b> {produce.totalQuantityKg} kg</p>
        <p><b>Price / kg:</b> ₹{produce.pricePerKg}</p>
        <p><b>Status:</b> {produce.status}</p>
      </div>

      {/* WINNING BID */}
      {winningBid ? (
        <div className="border p-4 rounded bg-green-50">
          <h2 className="font-semibold text-green-700 mb-2">
            Winning {user?.role ?? "User"}
          </h2>

          {user ? (
            <>
              <p><b>Name:</b> {user.name}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Role:</b> {user.role}</p>
              <p><b>Address:</b> {user.address}</p>
              <p><b>Bid Amount:</b> ₹{winningBid.bidAmount}</p>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Loading user details…
            </p>
          )}
        </div>
      ) : (
        <div className="text-gray-500 italic">
          No bids were placed for this produce.
        </div>
      )}
    </div>
  );
}
