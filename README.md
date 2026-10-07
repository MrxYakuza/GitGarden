# GitGarden

Turn your GitHub contribution year into a living, shareable garden.

GitGarden maps every day in a contribution calendar to one plot of land. Quiet
days remain soil, active days grow plants, and the busiest day becomes a golden
tree. The result can be explored in the browser, downloaded as SVG, or embedded
in a GitHub profile README.

## Features

- Interactive 53 × 7 contribution garden
- Clearly labelled landing-page preview without credentials
- Real public contribution data through GitHub GraphQL
- Forest, Midnight, and Sakura themes
- Contribution totals, active days, streaks, and best-day stats
- Server-rendered SVG endpoint for profile README embeds
- Responsive layout and reduced-motion support

## Quick start

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

Without a token, the landing page shows a clearly labelled preview. Requests
for a GitHub username return a configuration error instead of fabricated data.

## Use real GitHub data

1. Copy `.env.example` to `.env.local`.
2. Create a fine-grained GitHub token that can read public user information.
3. Add it to `.env.local`:

```env
GITHUB_TOKEN=github_pat_your_token_here
NEXT_PUBLIC_GITHUB_REPO_URL=https://github.com/USERNAME/GitGarden
```

4. Restart the development server.

The token is read only on the server and must never be committed.

## README embed

After deployment, profile images use this endpoint:

```md
![My GitGarden](https://your-domain.com/api/garden/USERNAME?year=2026&theme=forest)
```

Available themes are `forest`, `midnight`, and `sakura`.

## Project structure

```text
app/
  api/contributions/[username]/  JSON contribution data
  api/garden/[username]/         SVG garden image
components/
  git-garden.tsx                 Interactive application
lib/
  garden.ts                      Garden model and sample generator
  garden-svg.ts                  SVG renderer and theme tokens
  github.ts                      GitHub GraphQL integration
```

## Production check

```bash
npm run build
```

## Roadmap

- GitHub sign-in for private contribution totals
- Organization and team gardens
- Animated year timelapses
- More community-created themes
- Automated tests for garden generation and SVG output

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request. Issues
labelled `good first issue` are intended for new contributors.

## License

[MIT](./LICENSE)
