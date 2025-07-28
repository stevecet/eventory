"use client";

import { useState } from "react";
import {
  Calendar,
  Search,
  Plus,
  Bell,
  User,
  LogOut,
  Settings,
  Shield,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import EventDiscovery from "@/components/event-discovery";
import EventDetail from "@/components/event-detail";
import CreateEventForm from "@/components/create-event-form";
import MyEvents from "@/components/my-events";
import AdminDashboard from "@/components/admin-dashboard";
import OrganizerDashboard from "@/components/organizer-dashboard";
import RegistrationForm from "@/components/registration-form";
import RegistrationConfirmation from "@/components/registration-confirmation";
import TicketDownload from "@/components/ticket-download";
import WebSocketProvider from "@/components/websocket-provider";
import AuthProvider, { useAuth } from "@/components/auth/auth-provider";
import AuthModal from "@/components/auth/auth-modal";
import UserProfile from "@/components/auth/user-profile";
import ProtectedRoute from "@/components/auth/protected-route";
import NotificationsDialog from "@/components/notifications-dialog";
import FavoriteEvents from "@/components/favorite-events";
import LocaleSwitcher from "@/components/locale-switcher";

// Mock event data with enhanced details
const mockEvents = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description:
      "Annual technology conference featuring the latest innovations in AI, blockchain, and web development. Join industry leaders and innovators for three days of learning and networking.",
    startDate: "2024-04-15",
    endDate: "2024-04-17",
    startTime: "09:00",
    endTime: "18:00",
    location: {
      venue: "San Francisco Convention Center",
      address: "747 Howard St",
      city: "San Francisco",
      country: "USA",
    },
    category: "Technology",
    attendees: 342,
    maxAttendees: 500,
    price: 299,
    isFree: false,
    organizer: {
      name: "TechCorp Inc.",
      avatar: "/placeholder.svg?height=40&width=40&text=TC",
      rating: 4.8,
      bio: "Leading technology conference organizer with 10+ years of experience in bringing together the brightest minds in tech.",
      email: "contact@techcorp.com",
      phone: "+1 (555) 123-4567",
      eventsOrganized: 25,
    },
    image: "/placeholder.svg?height=400&width=600&text=Tech+Conference+2024",
    tags: ["AI", "Blockchain", "Networking", "Innovation"],
    popularity: 95,
    createdAt: "2024-01-15",
    status: "published" as const,
    features: [
      "3 days of expert sessions",
      "Networking opportunities",
      "Lunch and refreshments included",
      "Certificate of attendance",
      "Access to presentation materials",
      "VIP networking dinner (VIP tickets only)",
    ],
    schedule: [
      {
        time: "09:00",
        title: "Registration & Welcome Coffee",
        description: "Check-in and networking with fellow attendees",
      },
      {
        time: "10:00",
        title: "Keynote: The Future of AI",
        speaker: "Dr. Sarah Johnson",
        description:
          "Exploring the next decade of artificial intelligence development",
      },
      {
        time: "11:30",
        title: "Panel: Blockchain in Enterprise",
        speaker: "Industry Experts",
        description: "Real-world applications and case studies",
      },
      {
        time: "14:00",
        title: "Workshop: Building Scalable Web Apps",
        speaker: "Mike Chen",
        description: "Hands-on session with modern development practices",
      },
    ],
    reviews: [
      {
        id: "1",
        name: "John Doe",
        rating: 5,
        comment:
          "Excellent conference with top-notch speakers and great networking opportunities. Highly recommended!",
        date: "2024-01-10",
        avatar: "/placeholder.svg?height=40&width=40&text=JD",
      },
      {
        id: "2",
        name: "Jane Smith",
        rating: 4,
        comment:
          "Great content and well-organized event. The AI sessions were particularly insightful.",
        date: "2024-01-08",
        avatar: "/placeholder.svg?height=40&width=40&text=JS",
      },
    ],
  },
  {
    id: 2,
    title: "Digital Marketing Masterclass",
    description:
      "Learn the latest digital marketing strategies and tools from industry experts. Perfect for marketers, entrepreneurs, and business owners.",
    startDate: "2024-05-20",
    endDate: "2024-05-20",
    startTime: "14:00",
    endTime: "17:00",
    location: {
      venue: "New York Business Center",
      address: "123 Business Ave",
      city: "New York",
      country: "USA",
    },
    category: "Business",
    attendees: 78,
    maxAttendees: 100,
    price: 89,
    isFree: false,
    organizer: {
      name: "Marketing Pro Academy",
      avatar: "/placeholder.svg?height=40&width=40&text=MPA",
      rating: 4.6,
      bio: "Premier marketing education provider with certified instructors and proven methodologies.",
      email: "info@marketingpro.com",
      phone: "+1 (555) 234-5678",
      eventsOrganized: 15,
    },
    image:
      "/placeholder.svg?height=400&width=600&text=Digital+Marketing+Masterclass",
    tags: ["Marketing", "Digital", "Strategy", "Business"],
    popularity: 82,
    createdAt: "2024-02-01",
    status: "published" as const,
    features: [
      "Expert-led sessions",
      "Practical case studies",
      "Marketing toolkit included",
      "Certificate of completion",
      "1-month follow-up support",
    ],
    schedule: [
      {
        time: "14:00",
        title: "Welcome & Introduction",
        description: "Overview of digital marketing landscape",
      },
      {
        time: "14:30",
        title: "Social Media Strategy",
        speaker: "Lisa Rodriguez",
        description: "Building effective social media campaigns",
      },
      {
        time: "15:30",
        title: "SEO & Content Marketing",
        speaker: "David Kim",
        description: "Driving organic traffic and engagement",
      },
      {
        time: "16:30",
        title: "Analytics & ROI Measurement",
        speaker: "Emma Thompson",
        description: "Measuring and optimizing campaign performance",
      },
    ],
    reviews: [],
  },
];

function AppContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "register">(
    "login"
  );
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showTicketDownload, setShowTicketDownload] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [locale, setLocale] = useState("en"); // Default locale

  const handleAuthRequired = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    setActiveTab("discover");
    setSelectedEvent(null);
    setShowRegistrationForm(false);
    setShowConfirmation(false);
    setShowTicketDownload(false);
  };

  const openAuthModal = (view: "login" | "register") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setShowRegistrationForm(false);
    setShowConfirmation(false);
    setShowTicketDownload(false);
  };

  const handleRegister = (eventId: number) => {
    if (!user) {
      handleAuthRequired();
      return;
    }
    const eventToRegister = mockEvents.find((e) => e.id === eventId);
    if (eventToRegister) {
      setSelectedEvent(eventToRegister); // Ensure selectedEvent is the full event object
      setShowRegistrationForm(true);
    }
  };

  const handleRegistrationSubmit = (data: any) => {
    setRegistrationData(data);
    setShowRegistrationForm(false);
    setShowConfirmation(true);
  };

  const handleConfirmationContinue = () => {
    setShowConfirmation(false);
    setShowTicketDownload(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "organizer":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTabsForRole = () => {
    const baseTabs = [
      { value: "discover", label: "Discover Events", icon: Search },
    ];

    if (user) {
      baseTabs.push(
        { value: "my-events", label: "My Events", icon: Calendar },
        // { value: "favorites", label: "Favorites", icon: Heart },
        { value: "profile", label: "Profile", icon: User }
      );

      if (user.role === "organizer" || user.role === "admin") {
        baseTabs.push(
          { value: "create", label: "Create Event", icon: Plus },
          { value: "organizer", label: "Dashboard", icon: Settings }
        );
      }

      if (user.role === "admin") {
        baseTabs.push({ value: "admin", label: "Admin Panel", icon: Shield });
      }
    }

    return baseTabs;
  };

  // Show ticket download
  if (showTicketDownload && selectedEvent && registrationData) {
    const ticketData = {
      id: `TKT-${Date.now()}`,
      eventTitle: selectedEvent.title,
      eventDate: new Date(selectedEvent.startDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      eventTime: `${selectedEvent.startTime} - ${selectedEvent.endTime}`,
      venue: selectedEvent.location.venue,
      address: `${selectedEvent.location.address}, ${selectedEvent.location.city}, ${selectedEvent.location.country}`,
      attendeeName: `${registrationData.firstName} ${registrationData.lastName}`,
      attendeeEmail: registrationData.email,
      ticketType: registrationData.ticketType || "Regular",
      price: selectedEvent.price,
      qrCode: `QR-${Date.now()}`,
      registrationDate: new Date().toLocaleDateString(),
      seatNumber: "A-15",
      specialInstructions:
        "Please bring a valid ID for verification at the entrance.",
    };

    return (
      <WebSocketProvider>
        <div className="min-h-screen bg-gray-50 py-8">
          <TicketDownload
            ticketData={ticketData}
            onClose={handleBackToEvents}
          />
        </div>
      </WebSocketProvider>
    );
  }

  // Show registration confirmation
  if (showConfirmation && selectedEvent && registrationData) {
    return (
      <WebSocketProvider>
        <div className="min-h-screen bg-gray-50 py-8">
          <RegistrationConfirmation
            event={selectedEvent}
            registrationId={`REG-${Date.now()}`}
            userEmail={registrationData.email}
            onContinue={handleConfirmationContinue}
          />
        </div>
      </WebSocketProvider>
    );
  }

  // Show registration form
  if (showRegistrationForm && selectedEvent) {
    return (
      <WebSocketProvider>
        <div className="min-h-screen bg-gray-50 py-8">
          <RegistrationForm
            event={selectedEvent}
            onSubmit={handleRegistrationSubmit}
            onCancel={() => setShowRegistrationForm(false)}
            isSubmitting={false}
          />
        </div>
      </WebSocketProvider>
    );
  }

  // Show event detail
  if (selectedEvent) {
    return (
      <WebSocketProvider>
        <div className="min-h-screen bg-gray-50 py-8">
          <EventDetail
            event={selectedEvent}
            onBack={handleBackToEvents}
            onRegister={handleRegister}
          />
        </div>
      </WebSocketProvider>
    );
  }

  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    EventHub
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <LocaleSwitcher
                  currentLocale={locale}
                  onLocaleChange={setLocale}
                />
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => setIsNotificationsOpen(true)}
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-8 w-8 rounded-full"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-black">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56"
                        align="end"
                        forceMount
                      >
                        <div className="flex items-center justify-start gap-2 p-2">
                          <div className="flex flex-col space-y-1 leading-none">
                            <p className="font-medium">{user.name}</p>
                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                              {user.email}
                            </p>
                            <Badge className={getRoleColor(user.role)}>
                              <Shield className="mr-1 h-3 w-3" />
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setActiveTab("profile")}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setActiveTab("my-events")}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          My Events
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setActiveTab("favorites")}
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          Favorites
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
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      onClick={() => openAuthModal("login")}
                      className="text-gray-600"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => openAuthModal("register")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-white border shadow-sm">
              {getTabsForRole().map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="discover" className="space-y-4">
              <EventDiscovery onEventSelect={handleEventSelect} />
            </TabsContent>

            <TabsContent value="my-events" className="space-y-4">
              <ProtectedRoute onAuthRequired={handleAuthRequired}>
                <MyEvents
                  allEvents={mockEvents}
                  onEventSelect={handleEventSelect}
                />
              </ProtectedRoute>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <ProtectedRoute onAuthRequired={handleAuthRequired}>
                <FavoriteEvents
                  allEvents={mockEvents}
                  onEventSelect={handleEventSelect}
                />
              </ProtectedRoute>
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <ProtectedRoute
                requiredRole="organizer"
                onAuthRequired={handleAuthRequired}
              >
                <CreateEventForm />
              </ProtectedRoute>
            </TabsContent>

            <TabsContent value="organizer" className="space-y-4">
              <ProtectedRoute
                requiredRole="organizer"
                onAuthRequired={handleAuthRequired}
              >
                <OrganizerDashboard
                  allEvents={mockEvents}
                  onEventSelect={handleEventSelect}
                  onCreateEvent={() => setActiveTab("create")}
                />
              </ProtectedRoute>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <ProtectedRoute onAuthRequired={handleAuthRequired}>
                <UserProfile />
              </ProtectedRoute>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <ProtectedRoute
                requiredRole="admin"
                onAuthRequired={handleAuthRequired}
              >
                <AdminDashboard />
              </ProtectedRoute>
            </TabsContent>
          </Tabs>
        </main>

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultView={authModalView}
        />

        {/* Notifications Dialog */}
        <NotificationsDialog
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      </div>
    </WebSocketProvider>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
