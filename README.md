# PokéExplorer

A modern Pokémon exploration app built with Next.js, React, and TypeScript.

## Features

- Search Pokémon by name, type, and stats
- Dark/light mode support
- Responsive design for all devices
- Real-time search and filtering
- Powered by PokéAPI

## Getting Started

### Requirements

- Node.js 18+
- npm 8+

### Setup

1. Clone and install:
```bash
git clone https://github.com/shalomtou/pokemon-explorer.git
cd pokemon-explorer
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI components
- Zustand for state management

## Project Structure

```
pokemon-explorer/
├── app/              # Next.js pages
│   ├── api/             # API routes
│   ├── pokemon/         # Pokemon-related pages
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── ui/             # UI components
│   └── pokemon/        # Pokemon-specific components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── public/             # Static assets
├── store/             # Zustand store
├── styles/            # Global styles
└── types/             # TypeScript types
```

## Scripts

```bash
npm run dev         # Development server
npm run build      # Production build
npm run start      # Production server
npm run lint       # Lint code
```

## Contributing

1. Fork the repo
2. Create your feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE)

---
Built by Pokémon fans, for Pokémon fans 