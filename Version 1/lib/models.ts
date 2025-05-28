export interface User {
  _id?: string
  username: string
  email: string
  password: string
  createdAt: Date
}

export interface Pokemon {
  _id?: string
  name: string
  breed: string
  age: number
  health: number
  happiness: number
  imageUrl: string
  description: string
  adoptedBy?: string
  lastFed?: Date
  adoptedAt?: Date
  createdAt: Date
}

export interface Adoption {
  _id?: string
  userId: string
  pokemonId: string
  adoptedAt: Date
}
