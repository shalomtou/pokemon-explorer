import { PokemonList } from "@/components/pokemon-list"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-xl font-bold">PokéExplorer</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar />
            <ThemeToggle />
            <Button variant="outline" size="icon" asChild>
              <Link href="https://github.com/shalomtou/pokemon-explorer" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">View source on GitHub</span>
              </Link>
            </Button>
          </div>
        </nav>
      </header>
      <main className="flex-1 container py-6">
        <h1 className="sr-only">PokéExplorer - Explore Pokémon</h1>
        <PokemonList />
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            Built with Next.js, Tailwind CSS, and PokéAPI
          </p>
          <p className="text-center text-sm text-muted-foreground md:text-right">
            &copy; {new Date().getFullYear()} PokéExplorer
          </p>
        </div>
      </footer>
    </div>
  )
}

