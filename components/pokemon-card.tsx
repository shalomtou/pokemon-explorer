"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Pokemon } from "@/types/pokemon"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface PokemonCardProps {
  pokemon: Pokemon
  children?: ReactNode
}

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

export function PokemonCard({ pokemon, children }: PokemonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden h-full">
        <Link href={`/pokemon/${pokemon.id}`} className="block">
          <div className="relative pt-4 px-4 pb-2 bg-muted/50">
            <div className="absolute top-2 right-2 text-xs font-medium text-muted-foreground">
              #{String(pokemon.id).padStart(3, "0")}
            </div>
            <div className="flex justify-center">
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
                width={120}
                height={120}
                className="object-contain h-[120px] w-[120px] transition-transform duration-300 hover:scale-110"
                priority={pokemon.id <= 20}
              />
            </div>
          </div>
        </Link>
        <CardContent className="p-4">
          <Link href={`/pokemon/${pokemon.id}`} className="block">
            <h3 className="font-semibold text-lg capitalize mb-2">{pokemon.name}</h3>
            <div className="flex flex-wrap gap-1">
              {pokemon.types?.map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                  className={`${TYPE_COLORS[type] || "bg-gray-500"} text-white border-none`}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </Link>
        </CardContent>
        {children && <CardFooter className="p-4 pt-0 flex justify-end">{children}</CardFooter>}
      </Card>
    </motion.div>
  )
}

