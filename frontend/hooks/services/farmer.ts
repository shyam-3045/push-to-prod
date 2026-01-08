import api from "@/lib/axios";

export const getProduceResult = async (produceId: string) => {
  const response = await api.get(
    `/farmer/produce/${produceId}/result`
  );
  return response.data;
};