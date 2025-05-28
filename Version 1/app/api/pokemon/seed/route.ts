import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Pokemon } from "@/lib/models"

const initialPokemon: Omit<Pokemon, "_id" | "createdAt">[] = [
  {
    name: "Sparky",
    breed: "Pikachu",
    age: 2,
    health: 85,
    happiness: 90,
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    description: "A cheerful electric-type Pokemon who loves to play and make friends!",
  },
  {
    name: "Flame",
    breed: "Charmander",
    age: 1,
    health: 92,
    happiness: 75,
    imageUrl: "/placeholder.svg?height=200&width=200",
    description: "A young fire-type with lots of energy and a warm personality.",
  },
  {
    name: "Bubbles",
    breed: "Squirtle",
    age: 3,
    health: 78,
    happiness: 85,
    imageUrl: "/placeholder.svg?height=200&width=200",
    description: "A calm water-type who enjoys swimming and peaceful environments.",
  },
  {
    name: "Leafy",
    breed: "Bulbasaur",
    age: 2,
    health: 88,
    happiness: 80,
    imageUrl: "/placeholder.svg?height=200&width=200",
    description: "A gentle grass-type Pokemon who loves sunlight and fresh air.",
  },
  {
    name: "Psychic",
    breed: "Abra",
    age: 4,
    health: 70,
    happiness: 65,
    imageUrl: "/placeholder.svg?height=200&width=200",
    description: "A mysterious psychic-type who communicates through telepathy.",
  },
  {
    name: "Rocky",
    breed: "Geodude",
    age: 5,
    health: 95,
    happiness: 70,
    imageUrl: "/placeholder.svg?height=200&width=200",
    description: "A sturdy rock-type Pokemon with incredible strength and endurance.",
  },
]

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("pokemon_adoption")
    const pokemon = db.collection<Pokemon>("pokemon")

    // Check if pokemon already exist
    const existingCount = await pokemon.countDocuments()
    if (existingCount > 0) {
      return NextResponse.json({ message: "Pokemon already seeded" })
    }

    // Insert initial pokemon
    const pokemonWithDates = initialPokemon.map((p) => ({
      ...p,
      createdAt: new Date(),
    }))

    await pokemon.insertMany(pokemonWithDates)

    return NextResponse.json({ message: "Pokemon seeded successfully" })
  } catch (error) {
    console.error("Error seeding pokemon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
