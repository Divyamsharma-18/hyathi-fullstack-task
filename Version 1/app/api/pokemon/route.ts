import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import type { Pokemon } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("pokemon_adoption")
    const pokemon = db.collection<Pokemon>("pokemon")

    const allPokemon = await pokemon.find({}).toArray()

    return NextResponse.json(
      allPokemon.map((p) => ({
        ...p,
        id: p._id?.toString(),
        _id: undefined,
      })),
    )
  } catch (error) {
    console.error("Error fetching pokemon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const pokemonData = await request.json()

    const client = await clientPromise
    const db = client.db("pokemon_adoption")
    const pokemon = db.collection<Pokemon>("pokemon")

    const newPokemon: Omit<Pokemon, "_id"> = {
      ...pokemonData,
      createdAt: new Date(),
    }

    const result = await pokemon.insertOne(newPokemon)

    return NextResponse.json({
      ...newPokemon,
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error creating pokemon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
