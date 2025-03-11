"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FavoriteToggle } from "./favorite-toggle"
import type { PokemonDetails } from "@/types/pokemon"
import { useToast } from "@/hooks/use-toast"
import { usePokemonStore } from "@/store/pokemon-store"
import Image from "next/image"
import { motion } from "framer-motion"
import { Activity, AlertTriangle, Dna, Dumbbell, Zap } from "lucide-react"

const TYPE_COLORS = {
  normal: "bg-gray-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-stone-600",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-slate-400",
  fairy: "bg-pink-300",
}

export function PokemonDetail({ id }: { id: string }) {
  const { toast } = useToast()
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { favorites } = usePokemonStore()
  const isFavorite = favorites.some((f) => f.id === Number(id))

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/pokemon/${id}`)

        if (!response.ok) {
          if (response.status === 429) {
            setError("Rate limit exceeded. Please try again in a few moments.")
            return
          }

          throw new Error(`Failed to fetch Pokémon details: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          setError(data.error)
          return
        }

        setPokemon(data)
      } catch (error) {
        console.error("Error fetching pokemon details:", error)
        setError("Failed to load Pokémon details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    // Add a small delay to avoid hitting rate limits
    const timer = setTimeout(() => {
      fetchPokemonDetails()
    }, 300)

    return () => clearTimeout(timer)
  }, [id, toast])

  if (isLoading) {
    return <PokemonDetailSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!pokemon) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Pokémon not found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="md:col-span-1"
      >
        <Card>
          <CardContent className="p-6">
            <div className="relative mb-4">
              <div className="absolute top-0 right-0">
                <FavoriteToggle pokemonId={pokemon.id} isFavorite={isFavorite} />
              </div>
              <div className="text-sm text-muted-foreground mb-1">#{String(pokemon.id).padStart(3, "0")}</div>
              <h1 className="text-3xl font-bold capitalize mb-2">{pokemon.name}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {pokemon.types.map((type) => (
                  <Badge key={type} className={`${TYPE_COLORS[type] || "bg-gray-500"} text-white border-none`}>
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-center bg-muted/50 rounded-lg p-4 mb-4">
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
                width={200}
                height={200}
                className="object-contain h-[200px] w-[200px]"
                priority
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Height</div>
                <div className="font-medium">{pokemon.height / 10} m</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Weight</div>
                <div className="font-medium">{pokemon.weight / 10} kg</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Base Exp</div>
                <div className="font-medium">{pokemon.base_experience || "N/A"}</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Abilities</div>
                <div className="font-medium capitalize">{pokemon.abilities.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="md:col-span-2"
      >
        <Tabs defaultValue="stats">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats">
              <Activity className="h-4 w-4 mr-2" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="abilities">
              <Zap className="h-4 w-4 mr-2" />
              Abilities
            </TabsTrigger>
            <TabsTrigger value="evolution">
              <Dna className="h-4 w-4 mr-2" />
              Evolution
            </TabsTrigger>
            <TabsTrigger value="moves">
              <Dumbbell className="h-4 w-4 mr-2" />
              Moves
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Base Stats</h3>
                <div className="space-y-4">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{stat.name.replace("-", " ")}</span>
                        <span className="font-medium">{stat.value}</span>
                      </div>
                      <Progress
                        value={(stat.value / 255) * 100}
                        className="h-2"
                        style={
                          {
                            backgroundColor: "var(--muted)",
                            "--progress-background": getStatColor(stat.name),
                          } as any
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="abilities" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Abilities</h3>
                <div className="grid gap-4">
                  {pokemon.abilities.map((ability, index) => (
                    <div key={index} className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-primary" />
                        <h4 className="font-medium capitalize">{ability.name.replace("-", " ")}</h4>
                        {ability.is_hidden && (
                          <Badge variant="outline" className="ml-auto">
                            Hidden
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ability.effect || "Effect description not available."}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolution" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Evolution Chain</h3>
                {pokemon.evolution_chain && pokemon.evolution_chain.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-4">
                    {pokemon.evolution_chain.map((evo, index) => (
                      <div key={index} className="flex items-center">
                        <div className="text-center">
                          <div className="bg-muted/50 p-3 rounded-lg mb-2">
                            <Image
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                              alt={evo.name}
                              width={80}
                              height={80}
                              className="object-contain"
                            />
                          </div>
                          <div className="capitalize font-medium">{evo.name}</div>
                          {evo.min_level && <div className="text-xs text-muted-foreground">Level {evo.min_level}</div>}
                        </div>
                        {index < pokemon.evolution_chain.length - 1 && (
                          <div className="mx-2 text-muted-foreground">→</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    This Pokémon does not evolve or evolution data is unavailable.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moves" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Moves</h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {pokemon.moves && pokemon.moves.length > 0 ? (
                    <>
                      {pokemon.moves.slice(0, 15).map((move, index) => (
                        <div key={index} className="bg-muted/30 p-2 rounded-lg">
                          <div className="capitalize text-sm">{move.replace("-", " ")}</div>
                        </div>
                      ))}
                      {pokemon.moves.length > 15 && (
                        <div className="bg-muted/30 p-2 rounded-lg text-center text-sm text-muted-foreground">
                          +{pokemon.moves.length - 15} more moves
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground col-span-full">Move data is unavailable.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

function PokemonDetailSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-16 mb-2" />
            <Skeleton className="h-8 w-48 mb-2" />
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-[200px] w-full mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Skeleton className="h-10 w-full mb-4" />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getStatColor(statName: string): string {
  const colors = {
    hp: "hsl(var(--success))",
    attack: "hsl(var(--destructive))",
    defense: "hsl(var(--primary))",
    "special-attack": "hsl(var(--warning))",
    "special-defense": "hsl(var(--secondary))",
    speed: "hsl(var(--accent))",
  }

  return colors[statName] || "hsl(var(--primary))"
}

