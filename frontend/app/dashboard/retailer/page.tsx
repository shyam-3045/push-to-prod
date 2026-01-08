"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useRetailerProduces } from "@/hooks/customHooks/useRetailerProducts";
import { useRunningBids } from "@/hooks/customHooks/useRunningBids";
import { usePlaceBid } from "@/hooks/customHooks/usePlaceBid";
import { useWonBids } from "@/hooks/customHooks/useWonBids";

export default function RetailerDashboard() {
  const router = useRouter();

  const {
    data: producesData,
    isLoading: producesLoading,
    isError: producesError,
  } = useRetailerProduces();

  const { data: wonBidsData, isLoading: wonBidsLoading } = useWonBids();

  const {
    data: runningBidsData,
    isLoading: runningBidsLoading,
    isError: runningBidsError,
  } = useRunningBids();

  const { mutateAsync: placeBid, isPending } = usePlaceBid();

  // store bid amount per produce
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
      alert(`Bid must be at least ₹${minimumAllowed}`);
      return;
    }

    try {
      const response = await placeBid({ produceId, bidAmount });
      alert(response.message || "Bid placed successfully");
      console.log("Bid success:", response);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to place bid. Please try again.";

      alert(message);
      console.error("Bid failed:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.replace("/");
  };

  if (producesLoading || runningBidsLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (producesError || runningBidsError) {
    return <div className="p-6 text-red-600">Failed to load dashboard</div>;
  }

  return (
    <div className="p-6 space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Retailer Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* AVAILABLE PRODUCES */}
      {producesData?.data.map((produce) => (
        <div
          key={produce._id}
          className="border rounded-lg p-4 shadow-sm bg-white"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold capitalize">{produce.name}</h3>

            <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded">
              {produce.status}
            </span>
          </div>

          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <p>Category: {produce.category}</p>
            <p>Total Quantity: {produce.totalQuantityKg} kg</p>
            <p>Price / kg: ₹{produce.pricePerKg}</p>
            <p>Min Bid / Box: ₹{produce.minBidPerBox}</p>
          </div>

          <div className="mt-3 border-t pt-2 text-sm text-gray-600">
            <p className="font-medium">Farmer</p>
            <p>{produce.farmer.name}</p>
            <p className="text-xs">{produce.farmer.address}</p>
          </div>

          {/* 🔥 FIRST BID (THIS STARTS BIDDING) */}
          <div className="mt-3 flex gap-2 items-center">
            <input
              type="number"
              min={produce.minBidPerBox}
              placeholder="Your bid"
              value={bidAmounts[produce._id] || ""}
              onChange={(e) => handleBidChange(produce._id, e.target.value)}
              className="border p-1 rounded w-32 text-sm"
            />

            <button
              onClick={() => handlePlaceBid(produce._id, produce.minBidPerBox)}
              disabled={isPending}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {isPending ? "Bidding..." : "Place First Bid"}
            </button>
          </div>
        </div>
      ))}

      {/* RUNNING BIDS */}
      <section>
        <h2 className="text-xl font-bold mb-4">Running Bids</h2>

        <div className="grid gap-4">
          {runningBidsData?.data.map((produce) => {
            const currentBidAmount = produce.currentBid?.bidAmount;

            return (
              <div
                key={produce._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold capitalize">
                    {produce.name}
                  </h3>

                  <span className="text-sm px-2 py-1 bg-orange-100 text-orange-700 rounded">
                    LIVE
                  </span>
                </div>

                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <p>Category: {produce.category}</p>
                  <p>Total Quantity: {produce.totalQuantityKg} kg</p>
                  <p>Min Bid / Box: ₹{produce.minBidPerBox}</p>
                  <p>
                    Bid Ends At:{" "}
                    {new Date(produce.bidEndTime).toLocaleTimeString()}
                  </p>
                </div>

                <div className="mt-3 border-t pt-2 text-sm space-y-2">
                  {currentBidAmount ? (
                    <p className="font-medium text-green-700">
                      Current Highest Bid: ₹{currentBidAmount}
                    </p>
                  ) : (
                    <p className="text-gray-500">No bids yet</p>
                  )}

                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min={
                        currentBidAmount
                          ? currentBidAmount + 1
                          : produce.minBidPerBox
                      }
                      placeholder="Your bid"
                      value={bidAmounts[produce._id] || ""}
                      onChange={(e) =>
                        handleBidChange(produce._id, e.target.value)
                      }
                      className="border p-1 rounded w-32 text-sm"
                    />

                    <button
                      onClick={() =>
                        handlePlaceBid(
                          produce._id,
                          produce.minBidPerBox,
                          currentBidAmount
                        )
                      }
                      disabled={isPending}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      {isPending ? "Bidding..." : "Place Bid"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {runningBidsData?.data.length === 0 && (
            <p className="text-gray-500">No running bids</p>
          )}
        </div>
      </section>
      {/* WON BIDS */}
      <section>
        <h2 className="text-xl font-bold mb-4">My Won Bids</h2>

        {wonBidsLoading && <p>Loading won bids...</p>}

        <div className="grid gap-4">
          {wonBidsData?.data.map((bid: any) => (
            <div
              key={bid._id}
              className="border rounded-lg p-4 shadow-sm bg-green-50"
            >
              <h3 className="text-lg font-semibold">{bid.produceId.name}</h3>

              <div className="text-sm text-gray-700 mt-1">
                <p>Category: {bid.produceId.category}</p>
                <p>Quantity: {bid.produceId.totalQuantityKg} kg</p>
                <p>Price / kg: ₹{bid.produceId.pricePerKg}</p>
                <p className="font-semibold text-green-700">
                  Winning Bid: ₹{bid.bidAmount}
                </p>
              </div>
            </div>
          ))}

          {wonBidsData?.data.length === 0 && (
            <p className="text-gray-500">No won bids yet</p>
          )}
        </div>
      </section>
    </div>
  );
}
