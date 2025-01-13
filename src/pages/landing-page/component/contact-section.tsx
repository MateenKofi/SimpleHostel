import { Facebook, Instagram } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <div className="bg-zinc-900 text-white py-16 px-4 rounded-3xl">
      <div className="container max-w-4xl mx-auto text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to <span className="text-red-500">Get Started</span>?
          </h2>
          <p className="text-zinc-400 text-lg">
            Find your perfect hostel and start your adventure. Let's make your travel dreams a reality!
          </p>
        </div>

        <Button 
          size="lg" 
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Book Your Stay
        </Button>

        <div className="pt-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a 
              href="#" 
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>
          
          <div className="h-12 w-12">
            <img
              src="/public/logo.png"
              alt="HostelFinder Logo"
              className="w-full h-full object-contain bg-white rounded-full " 
            />
          </div>
          
          <div className="text-zinc-400">
            <a href="tel:+1234567890" className="hover:text-white transition-colors">
             (+233) 54 398 3427
            </a>
          </div>
        </div>

        <div className="pt-8 text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} HostelFinder. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

