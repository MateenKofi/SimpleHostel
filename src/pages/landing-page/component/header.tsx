'use client'

import { useState } from 'react'
import { Menu, X, Home, Search, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link } from 'react-router-dom'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-2">
          <img src="/public/logo.png" alt="logo" className='w-10 animate-bounce' />
          <span className="text-lg font-bold">Fuse</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">Home</Link>
          <Link to="/find-hostel" className="text-sm font-medium hover:text-primary">Find Hostels</Link>
          
          <a href="#" className="text-sm font-medium hover:text-primary">Popular Cities</a>
          <a href="#" className="text-sm font-medium hover:text-primary">About Us</a>
          <a href="#" className="text-sm font-medium hover:text-primary">Contact</a>
        </nav>

        <div className="flex items-center ml-auto space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5" />
          </Button>
          <Button className="hidden md:flex">List Your Hostel</Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="text-sm font-medium hover:text-primary">Home</Link>
                <Link to="/find-hostel" className="text-sm font-medium hover:text-primary">Find Hostel</Link>
                <a href="#" className="text-sm font-medium hover:text-primary">Popular Cities</a>
                <a href="#" className="text-sm font-medium hover:text-primary">About Us</a>
                <a href="#" className="text-sm font-medium hover:text-primary">Contact</a>
                <Button className="w-full">List Your Hostel</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

