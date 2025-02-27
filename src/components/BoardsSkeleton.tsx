import { Skeleton } from "@/components/ui/skeleton";
import { BOARD_SKELETON_LIMIT } from "@/utils/constants";
import { getRandomArbitrary } from "@/utils/utils";

const BoardsSkeleton = () => {
  return (
    <div className="flex h-full items-start gap-2 overflow-x-hidden px-5 pt-16">
      {Array.from({ length: BOARD_SKELETON_LIMIT }, (_, index) => (
        <Skeleton
          key={index}
          style={{ maxHeight: `${getRandomArbitrary(30, 70)}%` }}
          className="h-full w-full shrink-0 rounded-md border md:w-80"
          suppressHydrationWarning={true} //  https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors
        />
      ))}
    </div>
  );
};

export default BoardsSkeleton;
