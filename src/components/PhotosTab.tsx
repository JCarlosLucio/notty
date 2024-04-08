import Link from "next/link";
import { type Dispatch, type SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { api } from "@/utils/api";

type PhotosTabProps = {
  setBg: Dispatch<SetStateAction<string | null>>;
};

const PhotosTab = ({ setBg }: PhotosTabProps) => {
  const { data: images } = api.board.getPhotos.useQuery({
    query: "",
    page: 1,
  });

  return (
    <TabsContent
      value="photos"
      className="flex overflow-hidden hover:overflow-y-scroll"
    >
      <div className="grid w-full grid-cols-3 gap-2">
        {images?.map((img) => (
          <Button
            type="button"
            key={img.id}
            size="xl"
            variant="outline"
            className="group flex shrink-0 flex-col justify-end"
            style={{ background: `url(${img.urls.thumb})` }}
            onClick={() => setBg(`url(${img.urls.full})`)}
          >
            <Link
              className="invisible w-full bg-card/50 px-1 text-start group-hover:visible"
              href={img.user.links.html}
              rel="noreferrer"
              target="_blank"
            >
              {img.user.name}
            </Link>
          </Button>
        ))}
      </div>
    </TabsContent>
  );
};

export default PhotosTab;
