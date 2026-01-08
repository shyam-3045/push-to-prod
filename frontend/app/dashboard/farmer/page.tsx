"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useProduces } from "@/hooks/customHooks/useProduces";
import { useCreateProduce } from "@/hooks/customHooks/useCreateProduce";
import { Produce, ProduceForm } from "@/types/produce";
import { useQueryClient } from "@tanstack/react-query";

export default function FarmerDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useProduces();
  const { mutate: createProduce, isPending } = useCreateProduce();

  const [open, setOpen] = useState<boolean>(false);

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

  if (isLoading) return <div className="p-6">Loading produces...</div>;
  if (isError)
    return <div className="p-6 text-red-600">Failed to load produces</div>;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Produces</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Produce
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="text-sm text-blue-600 hover:underline"
          >
            View Profile
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* PRODUCE LIST */}
      <div className="grid gap-4">
        {data?.data.map((produce) => (
          <div
            key={produce._id}
            onClick={() => {
              if (produce.status === "CLOSED") {
                router.push(`/farmer/produce/${produce._id}`);
              }
            }}
            className={`border rounded-lg p-4 shadow-sm bg-white
    ${
      produce.status === "CLOSED"
        ? "cursor-pointer hover:bg-gray-50"
        : "cursor-default"
    }`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{produce.name}</h2>
              <span className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded">
                {produce.status}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              <p>Category: {produce.category}</p>
              <p>Total Quantity: {produce.totalQuantityKg} kg</p>
              <p>Price / kg: ₹{produce.pricePerKg}</p>
              <p>Min Bid / Box: ₹{produce.minBidAmount}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add Produce</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Produce Name"
                required
                className="w-full border p-2 rounded"
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="FRUIT">Fruit</option>
                <option value="VEGETABLE">Vegetable</option>
              </select>

              <input
                type="number"
                name="totalQuantityKg"
                value={form.totalQuantityKg}
                onChange={handleChange}
                placeholder="Total Quantity (kg)"
                min={1}
                required
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                name="pricePerKg"
                value={form.pricePerKg}
                onChange={handleChange}
                placeholder="Price per kg"
                min={1}
                required
                className="w-full border p-2 rounded"
              />

              

             

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                >
                  {isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
