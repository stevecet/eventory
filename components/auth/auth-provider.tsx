"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User, AuthContextType } from "../../types/auth"

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Demo accounts for testing
const DEMO_ACCOUNTS = {
  "admin@example.com": {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin" as const,
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-01",
    lastLogin: new Date().toISOString(),
    isVerified: true,
    preferences: {
      notifications: true,
      newsletter: true,
      darkMode: false,
    },
  },
  "organizer@example.com": {
    id: "2",
    email: "organizer@example.com",
    name: "Event Organizer",
    role: "organizer" as const,
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-15",
    lastLogin: new Date().toISOString(),
    isVerified: true,
    preferences: {
      notifications: true,
      newsletter: false,
      darkMode: false,
    },
  },
  "user@example.com": {
    id: "3",
    email: "user@example.com",
    name: "Regular User",
    role: "user" as const,
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-02-01",
    lastLogin: new Date().toISOString(),
    isVerified: true,
    preferences: {
      notifications: false,
      newsletter: true,
      darkMode: true,
    },
  },
}

const DEMO_PASSWORDS = {
  "admin@example.com": "admin123",
  "organizer@example.com": "org123",
  "user@example.com": "user123",
}

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("auth_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const demoUser = DEMO_ACCOUNTS[email as keyof typeof DEMO_ACCOUNTS]
    const demoPassword = DEMO_PASSWORDS[email as keyof typeof DEMO_PASSWORDS]

    if (!demoUser || password !== demoPassword) {
      setIsLoading(false)
      return { success: false, error: "Invalid email or password" }
    }

    // Update last login
    const updatedUser = {
      ...demoUser,
      lastLogin: new Date().toISOString(),
    }

    setUser(updatedUser)
    localStorage.setItem("auth_user", JSON.stringify(updatedUser))
    setIsLoading(false)

    return { success: true }
  }

  const register = async (data: {
    name: string
    email: string
    password: string
    role: "user" | "organizer"
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if user already exists
    if (DEMO_ACCOUNTS[data.email as keyof typeof DEMO_ACCOUNTS]) {
      setIsLoading(false)
      return { success: false, error: "User with this email already exists" }
    }

    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      name: data.name,
      role: data.role,
      avatar: `/placeholder.svg?height=40&width=40&query=${data.name.replace(/\s+/g, "+")}+avatar`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isVerified: false,
      preferences: {
        notifications: true,
        newsletter: false,
        darkMode: false,
      },
    }

    setUser(newUser)
    localStorage.setItem("auth_user", JSON.stringify(newUser))
    setIsLoading(false)

    return { success: true }
  }

  const logout = async (): Promise<void> => {
    setUser(null)
    localStorage.removeItem("auth_user")
  }

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "No user logged in" }

    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem("auth_user", JSON.stringify(updatedUser))
    setIsLoading(false)

    return { success: true }
  }

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user exists
    const demoUser = DEMO_ACCOUNTS[email as keyof typeof DEMO_ACCOUNTS]
    if (!demoUser) {
      setIsLoading(false)
      return { success: false, error: "No account found with this email address" }
    }

    setIsLoading(false)
    return { success: true }
  }

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you'd validate the token here
    if (!token || token.length < 10) {
      setIsLoading(false)
      return { success: false, error: "Invalid or expired reset token" }
    }

    setIsLoading(false)
    return { success: true }
  }

  const verifyEmail = async (token: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "No user logged in" }

    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedUser = { ...user, isVerified: true }
    setUser(updatedUser)
    localStorage.setItem("auth_user", JSON.stringify(updatedUser))
    setIsLoading(false)

    return { success: true }
  }

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
