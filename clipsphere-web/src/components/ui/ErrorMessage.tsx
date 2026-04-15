import clsx from "clsx";

interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
  retry?: () => void;
}

export default function ErrorMessage({ title = "Error", message, className, retry }: ErrorMessageProps) {
  return (
    <div className={clsx("rounded-lg border border-error/30 bg-error/10 p-4", className)}>
      <h3 className="text-sm font-semibold text-error">{title}</h3>
      <p className="mt-1 text-sm text-text">{message}</p>
      {retry && (
        <button onClick={retry} className="mt-2 text-sm font-medium text-brand-400 hover:text-brand-300 underline">Try again</button>
      )}
    </div>
  );
}
