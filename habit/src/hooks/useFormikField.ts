import { useField, useFormikContext } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const useFormikField = <TField>(
  key: string
): {
  value: [TField | undefined, (field: TField) => void];
  error?: string;
} => {
  const [field, meta, helpers] = useField<TField>(key);

  const setValue = (newValue: TField) => {
    helpers.setValue(newValue);
  };

  return {
    value: [field.value, setValue],
    error: meta.error,
  };
};

export default useFormikField;
