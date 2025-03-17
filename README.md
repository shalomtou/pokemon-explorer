# PokéExplorer

A modern Pokémon exploration app built with Next.js and TypeScript. Browse, search, and discover Pokémon with a beautiful, responsive interface.

[Live Demo](https://pokadex-mahc9qtsc-shaloms-projects-97b5bfe2.vercel.app/)

![PokéExplorer Screenshot](public/placeholder-logo.png)

## Features

- 🔍 Search and filter Pokémon by name and type
- 🌓 Dark/Light mode with system preference detection
- 📱 Fully responsive design
- ⚡ Server-side rendering for optimal performance
- 💾 Local favorites storage
- 🎨 Modern UI with Tailwind CSS and Shadcn/ui

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **State Management:** Zustand
- **Data Source:** PokéAPI
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 8 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shalomtou/pokemon-explorer.git
cd pokemon-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
pokemon-explorer/
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── pokemon/       # Pokemon pages
│   └── layout.tsx     # Root layout
├── components/        # React components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── public/           # Static assets
├── store/           # Zustand store
└── types/           # TypeScript types
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## API Integration

This project uses the [PokéAPI](https://pokeapi.co/) for Pokémon data. The API is free to use and doesn't require authentication.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing the Pokémon data
- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Vercel](https://vercel.com) for hosting

---

Built with ❤️ by [Shalom Touitou](https://github.com/shalomtou) 