import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Validate environment variables at build time (throws on invalid config)
import "@app/env";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  // packages/env and packages/ui are internal workspace packages
  transpilePackages: ["@app/env", "@app/ui"],
};

export default withNextIntl(nextConfig);
