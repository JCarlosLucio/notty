import { type Dispatch, type SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { gradients } from "@/utils/gradients";

type ColorsTabProps = {
  setBg: Dispatch<SetStateAction<string | null>>;
};

const ColorsTab = ({ setBg }: ColorsTabProps) => {
  return (
    <TabsContent value="colors">
      <div className="flex justify-center gap-10 rounded-lg border p-4">
        <div className="grid w-full grid-cols-3 grid-rows-3 gap-2">
          {gradients.map((gradient) => (
            <Button
              type="button"
              key={gradient.id}
              size="lg"
              variant="outline"
              style={{ background: gradient.bg }}
              onClick={() => setBg(gradient.bg)}
            />
          ))}
        </div>
      </div>
    </TabsContent>
  );
};

export default ColorsTab;
