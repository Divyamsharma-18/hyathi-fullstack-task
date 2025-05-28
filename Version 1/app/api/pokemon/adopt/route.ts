import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import type { Pokemon } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { pokemonId } = await request.json()

    const client = await clientPromise
    const db = client.db("pokemon_adoption")
    const pokemon = db.collection<Pokemon>("pokemon")

    // Check if pokemon exists and is not already adopted
    const existingPokemon = await pokemon.findOne({ _id: new ObjectId(pokemonId) })
    if (!existingPokemon) {
      return NextResponse.json({ error: "Pokemon not found" }, { status: 404 })
    }

    if (existingPokemon.adoptedBy) {
      return NextResponse.json({ error: "Pokemon already adopted" }, { status: 400 })
    }

    // Adopt the pokemon
    const result = await pokemon.updateOne(
      { _id: new ObjectId(pokemonId) },
      {
        $set: {
          adoptedBy: decoded.userId,
          adoptedAt: new Date(),
          lastFed: new Date(),
        },
      },
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Failed to adopt pokemon" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adopting pokemon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
