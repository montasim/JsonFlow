# JsonFlow

> Format, validate, inspect, compare, and convert JSON in the browser.

[![Live app](https://img.shields.io/badge/Live-Netlify-00C7B7?logo=netlify&logoColor=white)](https://jsonflow.netlify.app)
[![Support on SupportKori](https://img.shields.io/badge/Support-SupportKori-00B8B5)](https://www.supportkori.com/montasim)

JsonFlow gives developers a focused workspace for inspecting JSON without a project-specific backend. It combines an editor, formatted output, tree navigation, comparison, file import, and common export formats.

**[Open the live app](https://jsonflow.netlify.app) · [Report an issue](https://github.com/montasim/JsonFlow/issues)**

> **Project status:** The verified Netlify deployment is available for normal use. The repository has no automated tests, CI workflow, or open-source license file.

## Features

- Format and minify JSON with selectable indentation
- Validation feedback with error line information
- Monaco-based input and read-only output editors
- Expandable tree view
- JSON comparison for added, removed, modified, and type-changed values
- Conversion to YAML, XML, CSV, and plain text
- Drag-and-drop JSON import, copy, and download
- Keyboard shortcuts and light/dark themes

## Use JsonFlow

1. Open the formatter.
2. Paste JSON or upload a JSON file.
3. Format, minify, or select an export format.
4. Inspect the output in editor or tree view.
5. Use /compare for a two-document structural comparison.

## Privacy and trust boundary

Formatting, validation, comparison, conversion, copy, and download are implemented in client components. No application API route for JSON submission exists in this repository. Browser extensions, hosting infrastructure, and copied/downloaded files remain outside that boundary.

Do not paste credentials, access tokens, private keys, regulated records, or other sensitive material into tools you have not independently reviewed. A public deployment can still be affected by browser extensions, hosting logs, or future code changes.

## Local development

### Prerequisites

- Node.js 20.9.0 or newer
- pnpm

```bash
git clone https://github.com/montasim/JsonFlow.git
cd JsonFlow
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Configuration

The formatter and comparison tools need no environment variables. Optional public metadata values are documented in [`.env.example`](.env.example):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_NAME` | Public product name |
| `NEXT_PUBLIC_APP_URL` | Canonical public URL |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact address shown by the app |

```bash
cp .env.example .env.local
```

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start development |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

No test command is currently defined.

## Technology

- Next.js 16 and React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui and Radix UI primitives
- Monaco Editor and js-yaml

## Project structure

| Path | Purpose |
| --- | --- |
| `components/json-converter.tsx` | Formatter workflow |
| `components/json-compare.tsx` | Two-document comparison |
| `lib/json-utils.ts` | Parsing, validation, formatting, and minification |
| `lib/json-conversions.ts` | YAML, XML, CSV, and text conversion |
| `app/compare/` | Comparison route |

## Deployment

The live application is deployed on Netlify at [https://jsonflow.netlify.app](https://jsonflow.netlify.app). A separate deployment should use the repository's `pnpm build` command and configure only the variables its features require.

## Limitations

- There is no automated test suite or CI workflow.
- Input size is constrained by browser memory and responsiveness; no performance limit is documented.
- Generated output should be reviewed before using it in source control or automated systems.
- CSV conversion necessarily flattens or serializes structures; verify the result for nested data.
- The repository does not include a dedicated security policy, contribution guide, or code of conduct.

## Contributing

Issues and focused pull requests are welcome. Run `pnpm lint` and `pnpm build` before submitting. Add tests when changing transformation behavior.

## Support and security

Use [GitHub Issues](https://github.com/montasim/JsonFlow/issues) for reproducible bugs and proposals. Never include sensitive input or credentials in a public issue.

No private vulnerability-reporting process is documented. Coordinate with the maintainer through the profile below before public disclosure.

## Funding

Support continued maintenance through [SupportKori](https://www.supportkori.com/montasim). Bug reports, documentation, and code contributions are also valuable.

## Author

Built and maintained by [Montasim](https://github.com/montasim).

## License status

No license file is included. Source visibility does not grant permission to copy, modify, or redistribute this project.
