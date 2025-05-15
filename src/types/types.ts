
export interface Pokemon {
  _id: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
  health: number;
  adoptionCost: number;
  lastFed: Date | string;
  isAdopted: boolean;
  isRare: boolean;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  coins: number;
  adoptedPokemons: Pokemon[];
  lastLogin: Date | string;
  lastTubaReward: Date | string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
