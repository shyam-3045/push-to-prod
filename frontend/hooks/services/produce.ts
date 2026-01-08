import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Produce {
  _id: string;
  farmerId: string;
  name: string;
  category: string;
  totalQuantityKg: number;
  pricePerKg: number;
  minBidPerBox: number;
  bidDurationMinutes: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  bidStartTime: string;
  bidEndTime: string;
}

export interface GetProducesResponse {
  status: string;
  count: number;
  data: Produce[];
}

export interface CreateProducePayload {
  name: string;
  category: "FRUIT" | "VEGETABLE" | "GRAIN";
  totalQuantityKg: number;
  pricePerKg: number;
  minBidPerBox: number;
  bidDurationMinutes: number;
}

export const getMyProduces = async (): Promise<GetProducesResponse> => {
  const res = await axios.get(`${API_URL}/farmer/getMyProduces`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.data;
};


export const createProduce = async (
  payload: CreateProducePayload
) => {
  const params = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    params.append(key, String(value));
  });

  const res = await axios.post(
    `${API_URL}/farmer/createProduce`,
    params,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data;
};