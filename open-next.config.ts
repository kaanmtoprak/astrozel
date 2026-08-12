import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";

/**
 * Prerendered routes are read from Workers static assets (no R2/KV).
 * Regional Cache API avoids repeating the assets lookup in the same colo.
 * No ISR/revalidateTag is used, so a read-only incremental cache is enough.
 */
export default defineCloudflareConfig({
	incrementalCache: withRegionalCache(staticAssetsIncrementalCache, {
		mode: "long-lived",
	}),
	enableCacheInterception: true,
});
