type LoaderProps = {
  className?: string;
  label?: string;
};

export function Loader({ className = "", label = "Loading" }: LoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`.trim()}>
      <div className="loader" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
