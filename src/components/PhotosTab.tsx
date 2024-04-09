import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import useDebounce from "@/hooks/useDebounce";
import { api } from "@/utils/api";

type PhotosTabProps = {
  setBg: Dispatch<SetStateAction<string | null>>;
};

const PhotosTab = ({ setBg }: PhotosTabProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 1000);

  const { data: photos } = api.board.getPhotos.useQuery({
    query: debouncedQuery,
    page: 1,
  });

  return (
    <TabsContent value="photos" className="flex overflow-y-hidden">
      <div className="flex w-full flex-col gap-3 pt-2">
        {/* Search input */}
        <div className="relative flex w-full items-center">
          <Label htmlFor="query" aria-label="search" className="absolute pl-3">
            <MagnifyingGlassIcon />
          </Label>
          <Input
            id="query"
            type="text"
            value={query}
            placeholder="Search photos"
            className="pl-9"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Photos */}
        <div className="flex flex-col overflow-hidden hover:overflow-y-scroll">
          <div className="grid w-full grid-cols-3 gap-2">
            {photos?.map((photo) => (
              <Button
                type="button"
                key={photo.id}
                size="xl"
                variant="outline"
                className="group flex shrink-0 flex-col justify-end"
                style={{ background: `url(${photo.urls.thumb})` }}
                onClick={() => setBg(`url(${photo.urls.full})`)}
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
            ))}
          </div>
        </div>

        <div className="text-xs">
          By using images from Unsplash, you agree to their{" "}
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
        </div>
      </div>
    </TabsContent>
  );
};

export default PhotosTab;
