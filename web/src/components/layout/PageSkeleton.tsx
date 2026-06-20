import {
  Skeleton,
} from "@/components/ui/skeleton";

const PageSkeleton =
  () => {

    return (
      <div className="space-y-4 p-6">

        <Skeleton className="h-10 w-64" />

        <Skeleton className="h-24 w-full" />

        <Skeleton className="h-24 w-full" />

        <Skeleton className="h-24 w-full" />

      </div>
    );
};

export default PageSkeleton;