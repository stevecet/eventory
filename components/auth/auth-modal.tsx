"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import LoginForm from "./login-form"
import RegisterForm from "./register-form"
import ForgotPasswordForm from "./forgot-password-form"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultView?: "login" | "register" | "forgot-password"
}

export default function AuthModal({ isOpen, onClose, defaultView = "login" }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<"login" | "register" | "forgot-password">(defaultView)

  const handleSuccess = () => {
    onClose()
    setCurrentView("login") // Reset to login view for next time
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "login":
        return (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setCurrentView("register")}
            onSwitchToForgotPassword={() => setCurrentView("forgot-password")}
          />
        )
      case "register":
        return <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={() => setCurrentView("login")} />
      case "forgot-password":
        return <ForgotPasswordForm onBack={() => setCurrentView("login")} onSuccess={() => setCurrentView("login")} />
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">{renderCurrentView()}</DialogContent>
    </Dialog>
  )
}
