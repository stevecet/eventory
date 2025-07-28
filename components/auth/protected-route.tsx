"use client"

import type React from "react"

import { useAuth } from "./auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Shield, Lock } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "organizer" | "user"
  fallback?: React.ReactNode
  onAuthRequired?: () => void
}

export default function ProtectedRoute({ children, requiredRole, fallback, onAuthRequired }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Authentication Required</h3>
            <p className="text-muted-foreground">You need to be logged in to access this content.</p>
          </div>
          <Button onClick={onAuthRequired}>Sign In</Button>
        </div>
      </div>
    )
  }

  if (requiredRole && !hasRequiredRole(user.role, requiredRole)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to access this content.
              {requiredRole && ` ${requiredRole} access required.`}
            </p>
          </div>
          <Alert>
            <AlertDescription>
              Current role: <strong>{user.role}</strong> | Required role: <strong>{requiredRole}</strong>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    admin: 3,
    organizer: 2,
    user: 1,
  }

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

  return userLevel >= requiredLevel
}
