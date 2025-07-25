"use client"

import { useState } from "react"
import { Calendar, Search, Plus, Bell, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import EventDiscovery from "@/components/event-discovery"
import CreateEventForm from "@/components/create-event-form"
import MyEvents from "@/components/my-events"
import AdminDashboard from "@/components/admin-dashboard"
import WebSocketProvider from "@/components/websocket-provider"
import AuthProvider, { useAuth } from "@/components/auth/auth-provider"
import AuthModal from "@/components/auth/auth-modal"
import UserProfile from "@/components/auth/user-profile"
import ProtectedRoute from "@/components/auth/protected-route"

function AppContent() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("discover")
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalView, setAuthModalView] = useState<"login" | "register">("login")

  const handleAuthRequired = () => {
    setIsAuthModalOpen(true)
  }

  const handleLogout = async () => {
    await logout()
    setActiveTab("discover")
  }

  const openAuthModal = (view: "login" | "register") => {
    setAuthModalView(view)
    setIsAuthModalOpen(true)
  }

  const getTabsForRole = () => {
    const baseTabs = [{ value: "discover", label: "Discover Events", icon: Search }]

    if (user) {
      baseTabs.push(
        { value: "my-events", label: "My Events", icon: Calendar },
        { value: "profile", label: "Profile", icon: User },
      )

      if (user.role === "organizer" || user.role === "admin") {
        baseTabs.push({ value: "create", label: "Create Event", icon: Plus })
      }

      if (user.role === "admin") {
        baseTabs.push({ value: "admin", label: "Admin", icon: Settings })
      }
    }

    return baseTabs
  }

  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <h1 className="text-xl font-bold text-gray-900">EventHub</h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <Button variant="ghost" size="sm">
                      <Bell className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <div className="flex items-center justify-start gap-2 p-2">
                          <div className="flex flex-col space-y-1 leading-none">
                            <p className="font-medium">{user.name}</p>
                            <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setActiveTab("my-events")}>
                          <Calendar className="mr-2 h-4 w-4" />
                          My Events
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" onClick={() => openAuthModal("login")}>
                      Sign In
                    </Button>
                    <Button onClick={() => openAuthModal("register")}>Sign Up</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
              {getTabsForRole().map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger key={tab.value} value={tab.value} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <TabsContent value="discover" className="space-y-4">
              <EventDiscovery />
            </TabsContent>

            <TabsContent value="my-events" className="space-y-4">
              <ProtectedRoute onAuthRequired={handleAuthRequired}>
                <MyEvents />
              </ProtectedRoute>
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <ProtectedRoute requiredRole="organizer" onAuthRequired={handleAuthRequired}>
                <CreateEventForm />
              </ProtectedRoute>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <ProtectedRoute onAuthRequired={handleAuthRequired}>
                <UserProfile />
              </ProtectedRoute>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <ProtectedRoute requiredRole="admin" onAuthRequired={handleAuthRequired}>
                <AdminDashboard />
              </ProtectedRoute>
            </TabsContent>
          </Tabs>
        </main>

        {/* Auth Modal */}
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultView={authModalView} />
      </div>
    </WebSocketProvider>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
