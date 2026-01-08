import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "FARMER" | "RETAILER" ;
  address: string;
}

export const getUserById = async (id: string): Promise<User> => {
  const res = await axios.get(`${API_URL}/farmer/retailer/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.data.data;
};


export const getMyProfile = async () => {
  const res = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data.data;
};