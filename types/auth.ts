export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "organizer" | "user"
  avatar?: string
  createdAt: string
  lastLogin: string
  isVerified: boolean
  preferences: {
    notifications: boolean
    newsletter: boolean
    darkMode: boolean
  }
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: {
    name: string
    email: string
    password: string
    role: "user" | "organizer"
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>
}
