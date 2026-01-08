export type ProduceStatus = "LISTED" | "BIDDING" | "CLOSED";
export type ProduceCategory = "FRUIT" | "VEGETABLE";

export interface Produce {
  _id: string;
  name: string;
  category: ProduceCategory;
  totalQuantityKg: number;
  pricePerKg: number;
  minBidAmount: number;
  status: ProduceStatus;
}
export interface ProduceForm {
  name: string;
  category: ProduceCategory;
  totalQuantityKg: string;
  pricePerKg: string;
  minBidAmount: string;
  bidDurationMinutes: number;
}


export interface CurrentBid {
  _id: string;
  retailerId: string;
  bidAmount: number;
  createdAt: string;
}

export interface RunningBidProduce {
  _id: string;
  name: string;
  category: ProduceCategory;
  totalQuantityKg: number;
  minBidAmount: number;
  bidEndTime: string;
  currentBid: CurrentBid | null;
}

export interface GetRunningBidsResponse {
  status: string;
  count: number;
  data: RunningBidProduce[];
}
