"use client"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface LocaleSwitcherProps {
  currentLocale: string
  onLocaleChange: (locale: string) => void
}

export default function LocaleSwitcher({ currentLocale, onLocaleChange }: LocaleSwitcherProps) {
  const locales = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
  ]

  const selectedLocaleName = locales.find((l) => l.code === currentLocale)?.name || "English"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
          <Globe className="mr-2 h-4 w-4" />
          {selectedLocaleName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem key={locale.code} onClick={() => onLocaleChange(locale.code)}>
            {locale.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
