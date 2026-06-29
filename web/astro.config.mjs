import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { activeSite } from "./src/config/sites.js";

// One project, many sites: `SITE=<id> astro build`. The active site sets the
// canonical URL; content + theme are driven by its config. (Sitemap/SEO wired
// in a later pass.)
export default defineConfig({
  site: activeSite.url,
  integrations: [react()],
});
