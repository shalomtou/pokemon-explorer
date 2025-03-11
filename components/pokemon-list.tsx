"use client"

import { useCallback, useEffect, useState } from "react"
import { PokemonCard } from "./pokemon-card"
import { useInView } from "react-intersection-observer"
import { useSearchParams } from "next/navigation"
import { FavoriteToggle } from "./favorite-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "./ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { usePokemonStore } from "@/store/pokemon-store"
import { AlertTriangle } from "lucide-react"

export function PokemonList() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q")?.toLowerCase() || ""

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [retryCount, setRetryCount] = useState(0)

  const { pokemon, favorites, addPokemon, setFavorites } = usePokemonStore()

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  })

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await fetch("/api/favorites")
      if (!response.ok) throw new Error("Failed to fetch favorites")
      const data = await response.json()
      setFavorites(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load favorites. Please try again.",
        variant: "destructive",
      })
    }
  }, [setFavorites, toast])

  const fetchPokemon = useCallback(async (_limit?:number) => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    setError(null)

    try {
      const limit = _limit || 20
      const offset = (page - 1) * limit
      const response = await fetch(`/api/pokemon?limit=${limit}&offset=${offset}`)

      if (!response.ok) {
        if (response.status === 429) {
          setError("Rate limit exceeded. Please wait a moment before trying again.")

          // Retry after a delay if we hit rate limits
          if (retryCount < 3) {
            setTimeout(
              () => {
                setRetryCount((prev) => prev + 1)
                setIsLoading(false)
              },
              2000 * (retryCount + 1),
            ) // Exponential backoff
            return
          }
        }

        throw new Error(`Failed to fetch Pokémon: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      if (data.length === 0) {
        setHasMore(false)
        return
      }

      addPokemon(data)
      setPage((prev) => prev + 1)
      setRetryCount(0) // Reset retry count on success
    } catch (error) {
      console.error("Error fetching Pokemon:", error)
      setError("Failed to load Pokémon. Please try again.")

      toast({
        title: "Error",
        description: "Failed to load Pokémon. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, isLoading, hasMore, addPokemon, toast, retryCount])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  useEffect(() => {
    if (inView && !isLoading && !error) {
      // Add a small delay to avoid hitting rate limits
      const timer = setTimeout(() => {
        fetchPokemon()
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [inView, fetchPokemon, isLoading, error])

  // Initial load
  useEffect(() => {
    if (pokemon.length === 0 && !isLoading) {
      fetchPokemon(150)
    }
  }, [pokemon.length, fetchPokemon, isLoading])

  const filteredPokemon = pokemon.filter((p) => p.name.toLowerCase().includes(searchQuery))

  const displayedPokemon =
    activeTab === "favorites" ? filteredPokemon.filter((p) => favorites.some((f) => f.id === p.id)) : filteredPokemon

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Pokémon</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">
            {activeTab === "favorites" ? favorites.length : filteredPokemon.length} Pokémon
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          {displayedPokemon.length === 0 && !isLoading ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No Pokémon found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {displayedPokemon.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon}>
                  <FavoriteToggle
                    pokemonId={pokemon.id}
                    isFavorite={favorites.some((f) => f.id === pokemon.id)}
                    onToggle={fetchFavorites}
                  />
                </PokemonCard>
              ))}
              {isLoading &&
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                      <Skeleton className="h-40 w-full" />
                      <div className="p-4">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          {displayedPokemon.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {searchQuery ? "No favorites match your search" : "No favorites yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {displayedPokemon.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon}>
                  <FavoriteToggle pokemonId={pokemon.id} isFavorite={true} onToggle={fetchFavorites} />
                </PokemonCard>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {activeTab === "all" && hasMore && (
        <div ref={ref} className="flex justify-center py-4">
          {isLoading && <p>Loading more Pokémon...</p>}
        </div>
      )}
    </div>
  )
}

