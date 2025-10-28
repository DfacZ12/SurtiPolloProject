type typeA = "success" | "warning" | "error" | "info";

interface AlertProps {
  title: string;
  message: string;
  type: typeA;
}

export default function Alert({title, message, type }: AlertProps) {
  const colorClasses = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };
  return (
    <div>
      <div className={`p-4 ${colorClasses[type]} rounded-lg`} role="alert">
        <h3 className="font-bold text-base mb-1">{title}</h3>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
