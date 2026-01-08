export type ProduceCategory = "FRUIT" | "VEGETABLE";
export type ProduceStatus = "LISTED" | "BIDDING" | "CLOSED";

export interface Farmer {
  _id: string;
  name: string;
  address: string;
}

export interface Produce {
  _id: string;
  farmerId: string;
  name: string;
  category: ProduceCategory;
  totalQuantityKg: number;
  pricePerKg: number;
  minBidPerBox: number;
  bidDurationMinutes: number;
  status: ProduceStatus;
  createdAt: string;
  updatedAt: string;
  farmer: Farmer;
}

export interface GetProducesReatailResponse {
  status: string;
  count: number;
  data: Produce[];
}
