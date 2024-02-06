import ToggleHabitModel from "@/models/habit/ToogleHabit";
import { useMutation } from "@tanstack/react-query";
import { toggleHabitStatusAction } from "./action";
import { useLoadingOverlay } from "@/components/infrasructure/layout/LoadingOverlay";
import toast from "react-hot-toast";

export const useToggleHabit = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { setIsLoading } = useLoadingOverlay();

  const { mutate } = useMutation({
    mutationFn: (params: ToggleHabitModel) => toggleHabitStatusAction(params),
    onMutate: () => setIsLoading(true),
    onSettled: () => setIsLoading(false),
    onSuccess: () => {
      toast.success("Success change habit status");

      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });

  return { mutate };
};
