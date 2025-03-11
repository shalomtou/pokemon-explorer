import { create } from "zustand"
import type { Pokemon } from "@/types/pokemon"

interface PokemonState {
  pokemon: Pokemon[]
  favorites: { id: number; name?: string }[]
  addPokemon: (newPokemon: Pokemon[]) => void
  setFavorites: (favorites: { id: number; name?: string }[]) => void
}

export const usePokemonStore = create<PokemonState>((set) => ({
  pokemon: [],
  favorites: [],
  addPokemon: (newPokemon) =>
    set((state) => {
      // Filter out duplicates
      const uniqueNewPokemon = newPokemon.filter((p) => !state.pokemon.some((existing) => existing.id === p.id))
      return { pokemon: [...state.pokemon, ...uniqueNewPokemon] }
    }),
  setFavorites: (favorites) => set({ favorites }),
}))

