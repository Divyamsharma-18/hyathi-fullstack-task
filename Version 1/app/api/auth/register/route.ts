import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"
import type { User } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("pokemon_adoption")
    const users = db.collection<User>("users")

    // Check if user already exists
    const existingUser = await users.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const newUser: Omit<User, "_id"> = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    }

    const result = await users.insertOne(newUser)
    const token = generateToken(result.insertedId.toString())

    return NextResponse.json({
      user: {
        id: result.insertedId.toString(),
        username,
        email,
      },
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
