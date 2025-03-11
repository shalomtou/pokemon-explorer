"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface FavoriteToggleProps {
  pokemonId: number
  isFavorite: boolean
  onToggle?: () => void
}

export function FavoriteToggle({ pokemonId, isFavorite, onToggle }: FavoriteToggleProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFav, setIsFav] = useState(isFavorite)

  const toggleFavorite = async () => {
    setIsLoading(true)
    try {
      if (isFav) {
        const response = await fetch(`/api/favorites/${pokemonId}`, {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("Failed to remove from favorites")

        toast({
          title: "Removed from favorites",
          description: "This Pokémon has been removed from your favorites.",
        })
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: pokemonId }),
        })

        if (!response.ok) throw new Error("Failed to add to favorites")

        toast({
          title: "Added to favorites",
          description: "This Pokémon has been added to your favorites.",
        })
      }

      setIsFav(!isFav)
      if (onToggle) onToggle()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isLoading}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite()
      }}
      className={cn(
        "rounded-full transition-all",
        isFav ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground",
      )}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn("h-5 w-5", isFav ? "fill-current" : "")} />
    </Button>
  )
}

