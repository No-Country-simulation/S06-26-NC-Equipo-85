import { cn } from "@app/ui";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-16 text-center", className)}>
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold text-foreground">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}