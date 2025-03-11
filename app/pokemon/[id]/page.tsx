import { PokemonDetail } from "@/components/pokemon-detail"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function PokemonDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-8">
      <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "mb-6 gap-1 pl-2.5 text-muted-foreground")}>
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to list
      </Link>
      <PokemonDetail id={params.id} />
    </div>
  )
}

