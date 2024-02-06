type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function TextField({
  label,
  error,
  className,
  ...props
}: TextFieldProps) {
  return (
    <label className="form-control w-full ">
      <div className="label">
        {label && <span className="label-text text-label">{label}</span>}
      </div>
      <input
        {...props}
        className={`input input-bordered w-full rounded-md ${
          error != undefined ? "input-error" : ""
        }`}
      />
      <div className="label">
        {error && <span className="label-text-alt text-error">{error}</span>}
      </div>
    </label>
  );
}
