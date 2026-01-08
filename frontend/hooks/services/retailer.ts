import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface WonBid {
  _id: string;
  bidAmount: number;
  createdAt: string;
  produceId: {
    _id: string;
    name: string;
    category: string;
    totalQuantityKg: number;
    pricePerKg: number;
  };
}

export const getWonBids = async () => {
  const res = await axios.get(`${API_URL}/retailer/myWonBids`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.data;
};

export const getFarmerForWonBid = async (bidId: string) => {
  const res = await axios.get(
    `${API_URL}/retailer/bids/${bidId}/farmer`
  , {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data.data;
};