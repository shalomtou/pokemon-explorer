import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const FAVORITES_FILE = path.join(process.cwd(), "favorites.json")

// Initialize favorites file if it doesn't exist
async function initFavorites() {
  try {
    await fs.access(FAVORITES_FILE)
  } catch (error) {
    // File doesn't exist, create it with an empty array
    await fs.writeFile(FAVORITES_FILE, JSON.stringify([]))
  }
}

// Get favorites from file
async function getFavorites() {
  try {
    await initFavorites()
    const data = await fs.readFile(FAVORITES_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading favorites:", error)
    return []
  }
}

// Save favorites to file
async function saveFavorites(favorites: any[]) {
  try {
    await fs.writeFile(FAVORITES_FILE, JSON.stringify(favorites, null, 2))
    return true
  } catch (error) {
    console.error("Error saving favorites:", error)
    return false
  }
}

export async function GET() {
  try {
    const favorites = await getFavorites()
    return NextResponse.json(favorites)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, name } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Pokemon ID is required" }, { status: 400 })
    }

    const favorites = await getFavorites()

    // Check if already a favorite
    if (favorites.some((f: any) => f.id === id)) {
      return NextResponse.json({ error: "Pokemon is already a favorite" }, { status: 400 })
    }

    // If name is not provided, fetch it
    let pokemonName = name
    if (!pokemonName) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const data = await response.json()
        pokemonName = data.name
      } catch (error) {
        console.error("Error fetching Pokemon name:", error)
      }
    }

    favorites.push({ id, name: pokemonName })
    const success = await saveFavorites(favorites)
    
    if (!success) {
      return NextResponse.json({ error: "Failed to save favorites" }, { status: 500 })
    }

    return NextResponse.json({ message: "Added to favorites" }, { status: 201 })
  } catch (error) {
    console.error("Error adding favorite:", error)
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 })
  }
}

