import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

export const DEFAULT_BASE_URL = "https://api.gupsh.app/api/v1";

export function cred(name: "PUBLISHABLE_KEY" | "SECRET_KEY" | "SITE_UUID"): string | undefined {
  return process.env[`GUPSH_${name}`] ?? process.env[`BENTO_${name}`];
}

export function getApiBaseUrl(): string {
  const raw = process.env.GUPSH_API_BASE_URL || process.env.BENTO_API_BASE_URL || DEFAULT_BASE_URL;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`Invalid API base URL: ${raw}`);
  }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || url.hostname.endsWith(".localhost");
  if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
    throw new Error("API base URL must be https (http is allowed for localhost only)");
  }
  if (url.pathname === "/" || url.pathname === "") url.pathname = "/api/v1";
  return url.toString().replace(/\/$/, "");
}

export async function fetchBentoJson(
  path: string,
  query: Record<string, string> = {},
): Promise<unknown> {
  const publishableKey = cred("PUBLISHABLE_KEY");
  const secretKey = cred("SECRET_KEY");
  const siteUuid = cred("SITE_UUID");

  if (!publishableKey || !secretKey || !siteUuid) {
    throw new Error(
      "Missing required environment variables: BENTO_PUBLISHABLE_KEY, BENTO_SECRET_KEY, BENTO_SITE_UUID",
    );
  }

  const params = new URLSearchParams({ site_uuid: siteUuid, ...query });
  const authHeader = Buffer.from(`${publishableKey}:${secretKey}`).toString(
    "base64",
  );
  const response = await fetch(`${getApiBaseUrl()}${path}?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${authHeader}`,
      Accept: "application/json",
      "User-Agent": `gupsh-mcp/${packageJson.version}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`[${response.status}] - ${text || response.statusText}`);
  }

  return response.json();
}
