"use client"

import { useState, useEffect } from "react"

interface Pokemon {
  id: string
  name: string
  breed: string
  age: number
  health: number
  happiness: number
  imageUrl: string
  description: string
  adoptedBy?: string
  lastFed?: string
  adoptedAt?: string
}

export function usePokemon(token: string | null) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPokemon = async () => {
    try {
      const response = await fetch("/api/pokemon")
      if (response.ok) {
        const data = await response.json()
        setPokemon(data)
      }
    } catch (error) {
      console.error("Error fetching pokemon:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPokemon()
  }, [])

  const adoptPokemon = async (pokemonId: string) => {
    if (!token) return

    try {
      const response = await fetch("/api/pokemon/adopt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pokemonId }),
      })

      if (response.ok) {
        await fetchPokemon() // Refresh pokemon list
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to adopt pokemon")
      }
    } catch (error) {
      console.error("Error adopting pokemon:", error)
      throw error
    }
  }

  const feedPokemon = async (pokemonId: string) => {
    if (!token) return

    try {
      const response = await fetch("/api/pokemon/feed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pokemonId }),
      })

      if (response.ok) {
        await fetchPokemon() // Refresh pokemon list
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to feed pokemon")
      }
    } catch (error) {
      console.error("Error feeding pokemon:", error)
      throw error
    }
  }

  return { pokemon, loading, adoptPokemon, feedPokemon, refetch: fetchPokemon }
}
