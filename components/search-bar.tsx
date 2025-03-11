"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)

    if (debouncedSearchTerm) {
      params.set("q", debouncedSearchTerm)
    } else {
      params.delete("q")
    }

    router.replace(`/?${params.toString()}`)
  }, [debouncedSearchTerm, router, searchParams])

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search Pokémon..."
        className="w-full pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}

