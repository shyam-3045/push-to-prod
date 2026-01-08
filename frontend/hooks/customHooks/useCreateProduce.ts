import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduce, CreateProducePayload } from "@/hooks/services/produce";

export const useCreateProduce = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProducePayload) => createProduce(data),

    onSuccess: () => {
      // Refresh produce list after creation
      queryClient.invalidateQueries({ queryKey: ["my-produces"] });
    },
  });
};
