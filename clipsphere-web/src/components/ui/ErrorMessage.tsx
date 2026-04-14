import clsx from "clsx";

interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
  retry?: () => void;
}

export default function ErrorMessage({ title = "Error", message, className, retry }: ErrorMessageProps) {
  return (
    <div className={clsx("rounded-lg border border-red-200 bg-red-50 p-4", className)}>
      <h3 className="text-sm font-semibold text-red-800">{title}</h3>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      {retry && (
        <button onClick={retry} className="mt-2 text-sm font-medium text-red-600 hover:text-red-500">Try again</button>
      )}
    </div>
  );
}
