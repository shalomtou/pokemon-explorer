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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid Pokemon ID" }, { status: 400 })
    }

    const favorites = await getFavorites()
    const updatedFavorites = favorites.filter((f: any) => f.id !== id)

    if (favorites.length === updatedFavorites.length) {
      return NextResponse.json({ error: "Pokemon not found in favorites" }, { status: 404 })
    }

    const success = await saveFavorites(updatedFavorites)
    
    if (!success) {
      return NextResponse.json({ error: "Failed to save favorites" }, { status: 500 })
    }

    return NextResponse.json({ message: "Removed from favorites" })
  } catch (error) {
    console.error("Error removing favorite:", error)
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
  }
}

