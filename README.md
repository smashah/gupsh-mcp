# gupsh MCP

A local stdio MCP server for gupsh, forked from [Bento MCP](https://github.com/bentonow/bento-mcp) under the MIT license. It keeps the upstream 20 tool names, arguments, and response text so existing assistant workflows can point at gupsh.

## Start

Run `npx -y @gupsh/mcp setup` to configure Claude Code, Claude Desktop, Cursor, or OpenCode. API keys are available in [gupsh Settings → API keys](https://app.gupsh.app/marketing/settings). The setup wizard stores credentials in `~/.gupsh/mcp/env` and offers a configurable API base URL.

For a direct stdio configuration, set the environment variables yourself:

| Variable | Purpose |
| --- | --- |
| `BENTO_PUBLISHABLE_KEY` | Site publishable key |
| `BENTO_SECRET_KEY` | Site secret key |
| `BENTO_SITE_UUID` | Site UUID |
| `BENTO_API_BASE_URL` | API base URL; defaults to `https://api.gupsh.app/api/v1` |

The server also accepts `GUPSH_PUBLISHABLE_KEY`, `GUPSH_SECRET_KEY`, `GUPSH_SITE_UUID`, and `GUPSH_API_BASE_URL` aliases, which take precedence over the matching `BENTO_*` variables. HTTPS is required for remote hosts; `http://localhost` and other loopback addresses are accepted for local development. A bare origin receives `/api/v1` automatically.

```json
{
  "mcpServers": {
    "gupsh": {
      "command": "npx",
      "args": ["-y", "@gupsh/mcp"],
      "env": {
        "BENTO_PUBLISHABLE_KEY": "your-publishable-key",
        "BENTO_SECRET_KEY": "your-secret-key",
        "BENTO_SITE_UUID": "your-site-uuid",
        "BENTO_API_BASE_URL": "https://api.gupsh.app/api/v1"
      }
    }
  }
}
```

For Claude Code, run `npx -y @gupsh/mcp setup --client claude-code`. For a local gupsh API, set `BENTO_API_BASE_URL=http://localhost:<api-port>/api/v1` before starting the server. The hosted alternative is `https://mcp.gupsh.app/mcp` and uses separate client configuration.

## Tools

The local server provides `get_subscriber`, `batch_import_subscribers`, `list_tags`, `create_tag`, `list_fields`, `create_field`, `track_event`, `get_site_stats`, `get_ads_stats`, `list_broadcasts`, `create_broadcast`, `list_automations`, `list_workflows`, `get_workflow`, `get_workflow_stats`, `list_sequences`, `create_sequence_email`, `get_email_template`, `update_email_template`, and `update_sequence_email`.

## Differences from upstream

The fork sends both SDK and direct HTTP requests to the configured API base URL, removes Bento's host allowlist, uses the exact `@bentonow/bento-node-sdk` 2.0.0 dependency, and changes setup, metadata, and the MCPB manifest to gupsh. Tool names, argument schemas, and response formatting remain upstream-compatible. The upstream source base is commit `212a9432433b3d6d55b85abcd7a89ac6f36ef788` (`@bentonow/bento-mcp` 1.3.3).

The source is MIT licensed; see [LICENSE](LICENSE) and [NOTICE](NOTICE).
