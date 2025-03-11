import { type NextRequest, NextResponse } from "next/server"
import { cache } from "@/lib/cache"

// Cache TTL in seconds (1 hour)
const CACHE_TTL = 3600

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Check cache first
    const cacheKey = `pokemon-list-${offset}-${limit}`
    const cachedData = cache.get(cacheKey)

    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // Fetch Pokemon list
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
      }

      throw new Error(`Failed to fetch from PokeAPI: ${response.status}`)
    }

    const data = await response.json()

    // Process and enhance the data
    const enhancedPokemon = await Promise.all(
      data.results.map(async (pokemon: any, index: number) => {
        const id = offset + index + 1

        // Check cache for individual Pokemon details
        const pokemonCacheKey = `pokemon-basic-${id}`
        const cachedPokemon = cache.get(pokemonCacheKey)

        if (cachedPokemon) {
          return cachedPokemon
        }

        // Fetch additional details for each Pokemon
        try {
          const detailsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)

          if (!detailsResponse.ok) {
            if (detailsResponse.status === 429) {
              // Return basic info if rate limited
              const basicInfo = {
                id,
                name: pokemon.name,
              }
              cache.set(pokemonCacheKey, basicInfo, CACHE_TTL)
              return basicInfo
            }

            throw new Error(`Failed to fetch Pokemon details: ${detailsResponse.status}`)
          }

          const details = await detailsResponse.json()

          const pokemonInfo = {
            id,
            name: pokemon.name,
            types: details.types.map((t: any) => t.type.name),
            sprite: details.sprites.front_default,
          }

          // Cache the individual Pokemon data
          cache.set(pokemonCacheKey, pokemonInfo, CACHE_TTL)

          return pokemonInfo
        } catch (error) {
          console.error(`Error fetching details for ${pokemon.name}:`, error)
          // If details fetch fails, return basic info
          return {
            id,
            name: pokemon.name,
          }
        }
      }),
    )

    // Cache the complete list
    cache.set(cacheKey, enhancedPokemon, CACHE_TTL)

    return NextResponse.json(enhancedPokemon)
  } catch (error) {
    console.error("Error fetching Pokemon:", error)
    return NextResponse.json({ error: "Failed to fetch Pokemon data. Please try again later." }, { status: 500 })
  }
}

