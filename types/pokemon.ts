export interface Pokemon {
  id: number
  name: string
  types?: string[]
  sprite?: string
}

export interface PokemonDetails {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  types: string[]
  abilities: {
    name: string
    is_hidden: boolean
    effect?: string
  }[]
  stats: {
    name: string
    value: number
  }[]
  moves: string[]
  evolution_chain: {
    id: number
    name: string
    min_level?: number
  }[]
}

