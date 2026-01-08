import axios from "axios";
import { GetRunningBidsResponse } from "@/types/produce";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const getRunningBids = async (): Promise<GetRunningBidsResponse> => {
  const token = localStorage.getItem("token");

  const res = await axios.get<GetRunningBidsResponse>(
    `${API_URL}/retailer/running-bids`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
