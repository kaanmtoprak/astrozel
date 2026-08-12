/**
 * OpenNext Cloudflare entry wrapper.
 * Applies Daily Sky HTML edge-cache headers after OpenNext renders,
 * so Next's default dynamic `no-store` does not block Workers Cache.
 */
// @ts-expect-error OpenNext build output (generated before wrangler deploy)
import openNextWorker from "../.open-next/worker.js";
import { applyDailySkyEdgeCacheHeaders } from "../src/features/daily-sky/utils/daily-sky-html-cache";

export {
	// @ts-expect-error OpenNext build output
	DOQueueHandler,
	// @ts-expect-error OpenNext build output
	DOShardedTagCache,
	// @ts-expect-error OpenNext build output
	BucketCachePurge,
} from "../.open-next/worker.js";

type WorkerFetch = (
	request: Request,
	env: CloudflareEnv,
	ctx: ExecutionContext,
) => Promise<Response>;

const openNextFetch = (openNextWorker as { fetch: WorkerFetch }).fetch;

const worker = {
	async fetch(
		request: Request,
		env: CloudflareEnv,
		ctx: ExecutionContext,
	): Promise<Response> {
		const response = await openNextFetch(request, env, ctx);
		return applyDailySkyEdgeCacheHeaders(request, response);
	},
};

export default worker;
