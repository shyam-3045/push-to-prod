import axios from "axios";
import { GetProducesReatailResponse } from "@/types/produceReatailer";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const getRetailerProduces = async (): Promise<GetProducesReatailResponse> => {
  const token = localStorage.getItem("token");

  const res = await axios.get<GetProducesReatailResponse>(
    `${API_URL}/retailer/getProduces`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
