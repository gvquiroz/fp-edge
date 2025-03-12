/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    let details: Record<string, any> = {};

    // ✅ Request Info
    details.method = request.method;
    details.url = request.url;
    details.queryString = new URL(request.url).searchParams.toString();

    // ✅ Request Headers
    let headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    details.headers = headers;

    // ✅ Cloudflare Metadata
    details.cfInfo = {
      ip: request.headers.get("cf-connecting-ip"),
      country: request.cf?.country || "Unknown",
      colo: request.cf?.colo || "Unknown",
      asn: request.cf?.asn || "Unknown",
      city: request.cf?.city || "Unknown",
      region: request.cf?.region || "Unknown",
    };

    // ✅ Request Body (if applicable)
    if (request.method !== "GET" && request.method !== "HEAD") {
      try {
        details.body = await request.text();
      } catch (e) {
        details.body = "Error reading body";
      }
    }

    // ✅ Return JSON Response
    return new Response(JSON.stringify(details, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
} satisfies ExportedHandler<Env>;