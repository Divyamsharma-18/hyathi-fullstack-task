"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Star, Clock, Search, Filter, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { usePokemon } from "@/hooks/usePokemon"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function PokemonAdoptionApp() {
  const { user, token, loading: authLoading, login, register, logout } = useAuth()
  const { pokemon, loading: pokemonLoading, adoptPokemon, feedPokemon } = usePokemon(token)
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("browse")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBreed, setFilterBreed] = useState("all")
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Seed pokemon data on first load
  useEffect(() => {
    const seedPokemon = async () => {
      try {
        await fetch("/api/pokemon/seed", { method: "POST" })
      } catch (error) {
        console.error("Error seeding pokemon:", error)
      }
    }
    seedPokemon()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await login(loginForm.username, loginForm.password)
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })
      setActiveTab("browse")
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await register(registerForm.username, registerForm.email, registerForm.password)
      toast({
        title: "Account created!",
        description: "Welcome to the Pokemon Adoption Center!",
      })
      setActiveTab("browse")
      setRegisterForm({ username: "", email: "", password: "" })
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAdopt = async (pokemonId: string) => {
    try {
      await adoptPokemon(pokemonId)
      toast({
        title: "Adoption successful!",
        description: "Your new Pokemon is waiting for you in 'My Pokemon'.",
      })
      setActiveTab("my-pokemon")
    } catch (error) {
      toast({
        title: "Adoption failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFeed = async (pokemonId: string, pokemonName: string) => {
    try {
      await feedPokemon(pokemonId)
      toast({
        title: "Fed successfully!",
        description: `${pokemonName} is happy and healthy!`,
      })
    } catch (error) {
      toast({
        title: "Feeding failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return "bg-green-500"
    if (health >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getHappinessColor = (happiness: number) => {
    if (happiness >= 80) return "bg-pink-500"
    if (happiness >= 50) return "bg-blue-500"
    return "bg-gray-500"
  }

  const filteredPokemon = pokemon.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.breed.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBreed = filterBreed === "all" || p.breed === filterBreed
    return matchesSearch && matchesBreed
  })

  const availablePokemon = filteredPokemon.filter((p) => !p.adoptedBy)
  const myPokemon = pokemon.filter((p) => p.adoptedBy === user?.id)
  const breeds = [...new Set(pokemon.map((p) => p.breed))]

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-purple-700">Pokemon Adoption Center</CardTitle>
            <CardDescription>Find your perfect Pokemon companion!</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Login
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="reg-username">Username</Label>
                    <Input
                      id="reg-username"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, username: e.target.value }))}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Register
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-700">Pokemon Adoption Center</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.username}!</span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {pokemonLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="browse">Browse Pokemon</TabsTrigger>
              <TabsTrigger value="my-pokemon">My Pokemon ({myPokemon.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search Pokemon by name or breed..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterBreed} onValueChange={setFilterBreed}>
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by breed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Breeds</SelectItem>
                      {breeds.map((breed) => (
                        <SelectItem key={breed} value={breed}>
                          {breed}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availablePokemon.map((p) => (
                    <Card key={p.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-32 h-32 object-cover rounded-full"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{p.name}</CardTitle>
                            <CardDescription>
                              {p.breed} • {p.age} years old
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">{p.breed}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">{p.description}</p>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Health</span>
                            <span>{p.health}%</span>
                          </div>
                          <Progress value={p.health} className={`h-2 ${getHealthColor(p.health)}`} />

                          <div className="flex justify-between text-sm">
                            <span>Happiness</span>
                            <span>{p.happiness}%</span>
                          </div>
                          <Progress value={p.happiness} className={`h-2 ${getHappinessColor(p.happiness)}`} />
                        </div>

                        <Button onClick={() => handleAdopt(p.id)} className="w-full">
                          <Heart className="h-4 w-4 mr-2" />
                          Adopt {p.name}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {availablePokemon.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No Pokemon available for adoption matching your criteria.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="my-pokemon">
              <div className="space-y-6">
                {myPokemon.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">You haven't adopted any Pokemon yet.</p>
                    <Button onClick={() => setActiveTab("browse")}>Browse Available Pokemon</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myPokemon.map((p) => {
                      const hoursSinceLastFed = p.lastFed
                        ? (Date.now() - new Date(p.lastFed).getTime()) / (1000 * 60 * 60)
                        : 0
                      const needsFeeding = hoursSinceLastFed > 12

                      return (
                        <Card key={p.id} className={`overflow-hidden ${needsFeeding ? "ring-2 ring-red-300" : ""}`}>
                          <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative">
                            <img
                              src={p.imageUrl || "/placeholder.svg"}
                              alt={p.name}
                              className="w-32 h-32 object-cover rounded-full"
                            />
                            {needsFeeding && (
                              <Badge variant="destructive" className="absolute top-2 right-2">
                                Hungry!
                              </Badge>
                            )}
                          </div>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{p.name}</CardTitle>
                                <CardDescription>
                                  {p.breed} • {p.age} years old
                                </CardDescription>
                              </div>
                              <Badge variant="outline">
                                <Star className="h-3 w-3 mr-1" />
                                Adopted
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Health</span>
                                <span>{p.health}%</span>
                              </div>
                              <Progress value={p.health} className={`h-2`} />

                              <div className="flex justify-between text-sm">
                                <span>Happiness</span>
                                <span>{p.happiness}%</span>
                              </div>
                              <Progress value={p.happiness} className={`h-2`} />
                            </div>

                            {p.lastFed && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                Last fed: {Math.floor(hoursSinceLastFed)}h ago
                              </div>
                            )}

                            <Button
                              onClick={() => handleFeed(p.id, p.name)}
                              className="w-full"
                              variant={needsFeeding ? "default" : "outline"}
                            >
                              Feed {p.name}
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
      <Toaster />
    </div>
  )
}
