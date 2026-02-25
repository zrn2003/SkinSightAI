import { cn } from "@/lib/utils";

interface ConfidenceBarProps {
  value: number;
  variant?: "success" | "warning" | "danger" | "default";
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
}

const ConfidenceBar = ({
  value,
  variant = "default",
  showPercentage = true,
  size = "md"
}: ConfidenceBarProps) => {
  const safeValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return { bg: "bg-success shadow-[0_0_10px_rgba(16,185,129,0.5)]", text: "text-success" };
      case "warning":
        return { bg: "bg-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]", text: "text-warning" };
      case "danger":
        return { bg: "bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)]", text: "text-destructive" };
      default:
        return { bg: "bg-primary shadow-[0_0_10px_rgba(13,148,136,0.5)]", text: "text-primary" };
    }
  };

  const styleConfig = getVariantClasses();

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4"
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className={cn(
        "flex-1 rounded-full bg-muted overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            styleConfig.bg
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      {showPercentage && (
        <span className={cn("text-sm font-bold min-w-[3rem] text-right", styleConfig.text)}>
          {safeValue.toFixed(1)}%
        </span>
      )}
    </div>
  );
};

export default ConfidenceBar;
