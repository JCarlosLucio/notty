import { createApi } from "unsplash-js";

import { env } from "@/env.mjs";

/**
 * Unsplash API
 * https://github.com/unsplash/unsplash-js?tab=readme-ov-file#creating-an-instance
 */
export const unsplash = createApi({
  accessKey: env.UNSPLASH_ACCESS_KEY,
  //...other fetch options
});
