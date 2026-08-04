function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) {
  const base =
    "rounded-lg px-5 py-2 font-medium transition duration-200";

  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "border border-blue-600 text-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;