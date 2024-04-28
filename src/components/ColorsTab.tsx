import { type Dispatch, type SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { colors, gradients } from "@/utils/colors";

type ColorsTabProps = {
  setBg: Dispatch<
    SetStateAction<{ full: string | null; thumb: string | null }>
  >;
};

const ColorsTab = ({ setBg }: ColorsTabProps) => {
  return (
    <TabsContent value="colors" className="flex overflow-y-hidden">
      <div className="flex w-full gap-3 overflow-y-scroll pt-2 hover:overflow-y-scroll xl:overflow-hidden">
        <div className="grid w-2/3 grid-cols-2 content-start gap-2 md:grid-cols-3">
          {gradients.map((gradient) => (
            <Button
              type="button"
              key={gradient.id}
              size="lg"
              variant="outline"
              style={{ backgroundImage: gradient.bg, backgroundSize: "cover" }}
              onClick={() => setBg({ full: gradient.bg, thumb: gradient.bg })}
              aria-label={`Select '${gradient.name}' background`}
              data-testid="select-color-btn"
            />
          ))}
        </div>
        <div className="h-full border-l" />
        <div className="grid w-1/3 grid-cols-1 content-start gap-2 md:grid-cols-2">
          {colors.map((color) => (
            <Button
              type="button"
              key={color.id}
              size="lg"
              variant="outline"
              style={{ backgroundImage: color.bg }}
              onClick={() => setBg({ full: color.bg, thumb: color.bg })}
              aria-label={`Select '${color.name}' background`}
              data-testid="select-color-btn"
            />
          ))}
        </div>
      </div>
    </TabsContent>
  );
};

export default ColorsTab;
