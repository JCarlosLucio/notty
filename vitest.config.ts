import { config } from "dotenv";
import { resolve } from "path";
import { defineConfig } from "vitest/config";

const PATH_TO_ENV_TEST_FILE = "./.env.test.local";
const PATH_TO_ALIAS = "./src";

export default defineConfig({
  test: {
    env: {
      ...config({ path: PATH_TO_ENV_TEST_FILE }).parsed,
    },
    fileParallelism: false,
  },
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, PATH_TO_ALIAS) }],
  },
});
