import { type NextRequest, NextResponse } from "next/server"
import { cache } from "@/lib/cache"

// Cache TTL in seconds (1 hour)
const CACHE_TTL = 3600

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check cache first
    const cacheKey = `pokemon-${id}`
    const cachedData = cache.get(cacheKey)

    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // Fetch basic Pokemon data
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
      }

      return NextResponse.json({ error: "Pokemon not found" }, { status: response.status })
    }

    const data = await response.json()

    // Fetch species data for evolution chain
    const speciesResponse = await fetch(data.species.url)

    if (!speciesResponse.ok) {
      if (speciesResponse.status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
      }
    }

    const speciesData = await speciesResponse.json()

    // Fetch ability descriptions (limit to 3 to reduce API calls)
    const abilitiesWithEffects = await Promise.all(
      data.abilities.slice(0, 3).map(async (ability: any) => {
        try {
          // Check cache for ability data
          const abilityCacheKey = `ability-${ability.ability.name}`
          const cachedAbility = cache.get(abilityCacheKey)

          if (cachedAbility) {
            return cachedAbility
          }

          const abilityResponse = await fetch(ability.ability.url)

          if (!abilityResponse.ok) {
            if (abilityResponse.status === 429) {
              // Return basic info if rate limited
              return {
                name: ability.ability.name,
                is_hidden: ability.is_hidden,
                effect: "Information temporarily unavailable due to rate limiting.",
              }
            }

            throw new Error(`Failed to fetch ability: ${abilityResponse.status}`)
          }

          const abilityData = await abilityResponse.json()

          // Find English effect entry
          const effectEntry = abilityData.effect_entries.find((entry: any) => entry.language.name === "en")

          const abilityInfo = {
            name: ability.ability.name,
            is_hidden: ability.is_hidden,
            effect: effectEntry ? effectEntry.effect : "No description available.",
          }

          // Cache the ability data
          cache.set(abilityCacheKey, abilityInfo, CACHE_TTL)

          return abilityInfo
        } catch (error) {
          console.error(`Error fetching ability ${ability.ability.name}:`, error)
          return {
            name: ability.ability.name,
            is_hidden: ability.is_hidden,
            effect: "Failed to load ability information.",
          }
        }
      }),
    )

    // Process evolution chain
    let evolutionChain: any[] = []
    if (speciesData.evolution_chain) {
      try {
        // Check cache for evolution data
        const evoCacheKey = `evolution-${extractIdFromUrl(speciesData.evolution_chain.url)}`
        const cachedEvo = cache.get(evoCacheKey)

        if (cachedEvo) {
          evolutionChain = cachedEvo
        } else {
          const evolutionResponse = await fetch(speciesData.evolution_chain.url)

          if (!evolutionResponse.ok) {
            if (evolutionResponse.status === 429) {
              // Skip evolution chain if rate limited
              console.warn("Rate limit hit when fetching evolution chain")
            } else {
              throw new Error(`Failed to fetch evolution chain: ${evolutionResponse.status}`)
            }
          } else {
            const evolutionData = await evolutionResponse.json()

            // Process the evolution chain
            evolutionChain = await processEvolutionChain(evolutionData.chain)

            // Cache the evolution data
            cache.set(evoCacheKey, evolutionChain, CACHE_TTL)
          }
        }
      } catch (error) {
        console.error("Error fetching evolution chain:", error)
        // Continue with partial data
      }
    }

    // Format the response
    const pokemonDetails = {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      base_experience: data.base_experience,
      types: data.types.map((type: any) => type.type.name),
      abilities: abilitiesWithEffects,
      stats: data.stats.map((stat: any) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      // Limit moves to reduce payload size
      moves: data.moves.slice(0, 30).map((move: any) => move.move.name),
      evolution_chain: evolutionChain,
    }

    // Cache the complete pokemon details
    cache.set(cacheKey, pokemonDetails, CACHE_TTL)

    return NextResponse.json(pokemonDetails)
  } catch (error) {
    console.error("Error fetching Pokemon details:", error)
    return NextResponse.json({ error: "Failed to fetch Pokemon details. Please try again later." }, { status: 500 })
  }
}

async function processEvolutionChain(chain: any) {
  const evolutionChain = []

  // Process the current Pokemon in the chain
  const speciesUrl = chain.species.url
  const speciesId = extractIdFromUrl(speciesUrl)

  evolutionChain.push({
    id: speciesId,
    name: chain.species.name,
    min_level: null,
  })

  // Process evolution details if they exist
  let currentEvolution = chain.evolves_to

  while (currentEvolution && currentEvolution.length > 0) {
    const evolution = currentEvolution[0]
    const evoDetails = evolution.evolution_details[0]

    const evoSpeciesUrl = evolution.species.url
    const evoSpeciesId = extractIdFromUrl(evoSpeciesUrl)

    evolutionChain.push({
      id: evoSpeciesId,
      name: evolution.species.name,
      min_level: evoDetails?.min_level || null,
    })

    currentEvolution = evolution.evolves_to
  }

  return evolutionChain
}

function extractIdFromUrl(url: string) {
  const matches = url.match(/\/(\d+)\/$/)
  return matches ? Number.parseInt(matches[1]) : null
}

