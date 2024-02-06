"use client";
import NewHabitFormModel, { NewHabitModelKeys } from "@/models/habit/NewHabit";
import TrackingType, { TrackingTypeHelper } from "@/models/habit/TrackingType";
import { useFormik } from "formik";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import { createHabitAction } from "./action";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useLoadingOverlay } from "@/components/infrasructure/layout/LoadingOverlay";

const useNewHabitForm = () => {
  const { replace } = useRouter();

  const { setIsLoading } = useLoadingOverlay();

  const { isPending, mutate } = useMutation({
    mutationFn: async (params: NewHabitFormModel) => createHabitAction(params),
    onSuccess: () => {
      toast.success("Success create new habit");
      replace("/");
    },
    onError: (error) => {
      toast.error(error.message ?? "Unknown Error");
    },
  });

  const formik = useFormik<NewHabitFormModel>({
    initialValues: {
      schedule: new Set(),
    },
    validateOnChange: false,
    validationSchema: newHabitValidator,
    onSubmit: (value) => mutate(value),
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formik.submitForm();
  };

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending, setIsLoading]);

  return {
    formik,
    onSubmit,
    isFormLoading: isPending,
  };
};

const newHabitValidator = yup
  .object<NewHabitFormModel>()
  .shape({
    name: yup.string().required("The name of habit cannot be empty"),
    startDate: yup.mixed().required("Start date cannot be empty"),
    trackingType: yup
      .mixed<TrackingType>()
      .required("You have to choose tracking type")
      .oneOf(TrackingTypeHelper.values, "You have to choose tracking type"),
    weeklyGoal: yup.mixed().when("trackingType", {
      is: TrackingType.weekly,
      then: (value) => value.required("Weekly goal is required"),
    }),
    schedule: yup.mixed().when("trackingType", {
      is: TrackingType.daily,
      then: (value) =>
        value.test(
          "is-set",
          "Selected Days Cannot Be Empty",
          (value) => value instanceof Set && value.size != 0
        ),
    }),
  })
  .required();

export { useNewHabitForm };
