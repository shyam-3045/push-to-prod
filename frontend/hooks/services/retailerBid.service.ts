import axios from "axios";

interface PlaceBidPayload {
  produceId: string;
  bidAmount: number;
}

export interface PlaceBidResponse {
  status: string;
  message: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const placeBid = async (
  payload: PlaceBidPayload
): Promise<PlaceBidResponse> => {
  const token = localStorage.getItem("token");

  const res = await axios.post<PlaceBidResponse>(
    `${API_URL}/retailer/bid`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => status < 500
    }
  );

  return res.data;
};
