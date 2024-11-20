import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import useDebounce from "@/hooks/useDebounce";
import { api } from "@/utils/api";

type PhotosTabProps = {
  setBg: Dispatch<
    SetStateAction<{ full: string | null; thumb: string | null }>
  >;
};

const PhotosTab = ({ setBg }: PhotosTabProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 1000);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = api.board.getInfinitePhotos.useInfiniteQuery(
    {
      query: debouncedQuery,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  );

  return (
    <TabsContent value="photos" className="flex overflow-y-hidden">
      <div className="flex w-full flex-col gap-3 pt-2">
        {/* Search input */}
        <div className="relative flex w-full items-center px-[1px]">
          <Label
            htmlFor="query"
            aria-label="search photos"
            className="absolute pl-3"
          >
            <MagnifyingGlassIcon />
          </Label>
          <Input
            id="query"
            type="search"
            value={query}
            placeholder="Search photos"
            className="pl-9"
            onChange={(e) => setQuery(e.target.value)}
            data-testid="search-photos-input"
          />
        </div>

        {/* Photos */}
        <div className="flex flex-col gap-2 overflow-y-scroll hover:overflow-y-scroll xl:overflow-hidden">
          <div className="grid w-full grid-cols-3 gap-2">
            {data?.pages.map((pageData) =>
              pageData.photos?.map((photo) => (
                <Button
                  type="button"
                  key={photo.id}
                  size="xl"
                  variant="outline"
                  className="group flex shrink-0 flex-col justify-end"
                  style={{ background: `url(${photo.urls.thumb})` }}
                  onClick={() =>
                    setBg({
                      full: `url(${photo.urls.full})`,
                      thumb: `url(${photo.urls.small})`,
                    })
                  }
                  aria-label={`Select '${photo.alt_description}' background`}
                  data-testid="select-photo-btn"
                >
                  <Link
                    className="invisible w-full bg-card/50 px-1 text-start text-xs group-hover:visible"
                    href={photo.user.links.html}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {photo.user.name}
                  </Link>
                </Button>
              )),
            )}
          </div>

          {(isLoading || isFetchingNextPage) && (
            <div className="grid w-full grid-cols-3 gap-2">
              {Array.from({ length: 9 }, (_, index) => (
                <Skeleton key={index} className="h-28 rounded-md" />
              ))}
            </div>
          )}

          {hasNextPage && !isFetching && (
            <Button
              type="button"
              variant="outline"
              disabled={isFetching}
              className="w-max self-center text-muted-foreground"
              onClick={() => fetchNextPage()}
            >
              Show More Photos
            </Button>
          )}
        </div>

        <div className="text-xs">
          By using images from{" "}
          <Link
            className="hover:underline"
            href="https://unsplash.com/"
            rel="noreferrer"
            target="_blank"
          >
            Unsplash
          </Link>
          , you agree to their{" "}
          <Link
            className="hover:underline"
            href="https://unsplash.com/license"
            rel="noreferrer"
            target="_blank"
          >
            license
          </Link>{" "}
          and{" "}
          <Link
            className="hover:underline"
            href="https://unsplash.com/terms"
            rel="noreferrer"
            target="_blank"
          >
            Terms of Service
          </Link>
          .
        </div>
      </div>
    </TabsContent>
  );
};

export default PhotosTab;
