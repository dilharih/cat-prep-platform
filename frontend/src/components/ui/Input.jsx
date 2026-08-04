function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        {...props}
        className={`w-full rounded-lg border px-4 py-3 outline-none transition
        ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
            : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
        }
        focus:ring-2 ${className}`}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;