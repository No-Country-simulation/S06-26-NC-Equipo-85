import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Internal server vars (never expose to browser)
    NODE_ENV: z.enum(["development", "production"]).default("development"),
  },
  client: {
    // Public vars (safe to expose to browser)
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
