import { ClipboardList }
  from "lucide-react";

export default function EmptyState() {
  return (
    <div
      className="
        flex
        min-h-[300px]
        flex-col
        items-center
        justify-center
        rounded-lg
        border
        border-dashed
      "
    >
      <ClipboardList
        className="
          h-12
          w-12
          text-muted-foreground
        "
      />

      <h2
        className="
          mt-4
          text-lg
          font-semibold
        "
      >
        No tasks found
      </h2>

      <p
        className="
          mt-2
          text-sm
          text-muted-foreground
        "
      >
        Create your first task to
        get started.
      </p>
    </div>
  );
}