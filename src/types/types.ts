
export interface User {
  _id: string;
  username: string;
  email: string;
  coins: number;
  lastFairyReward?: Date | string;
  lastTubaReward?: Date | string;
}

export interface Pokemon {
  _id: string;
  name: string;
  type: string[];
  image: string;
  description: string;
  health: number;
  rarity: 'common' | 'rare' | 'legendary';
  price: number;
  isAdopted: boolean;
  lastFed?: Date | string;
  adoptedBy?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
