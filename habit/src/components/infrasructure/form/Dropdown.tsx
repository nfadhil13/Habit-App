type DropdownValue = number | string | undefined;

export type DropdownFieldItem<T extends DropdownValue> = {
  label: React.ReactNode;
  value: T;
  key: React.Key;
};

type DropdownFieldProps<T extends DropdownValue> =
  React.InputHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
    hint?: React.ReactNode;
    options?: DropdownFieldItem<T>[];
  };

export default function DropdownField<T extends DropdownValue>({
  label,
  error,
  hint,
  options = [],
  className,
  ...props
}: DropdownFieldProps<T>) {
  return (
    <label className="form-control w-full max-w">
      <div className="label">
        {label && <span className="label-text">{label}</span>}
      </div>
      <select
        className={`select select-bordered ${className} ${
          error != undefined ? "select-error" : ""
        }`}
        {...props}
      >
        {hint && <option defaultValue={""}>{hint}</option>}
        {...options.map((value) => (
          <option key={value.key} value={value.value}>
            {value.label}
          </option>
        ))}
      </select>
      <div className="label">
        {error && <span className="label-text-alt text-error">{error}</span>}
      </div>
    </label>
  );
}
