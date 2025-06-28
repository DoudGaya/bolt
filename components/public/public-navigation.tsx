'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sparkles, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SimpleThemeToggle } from '@/components/theme-switcher'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Features', href: '/#features' },
  { name: 'Contact', href: '/contact' },
]

export function PublicNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/90 dark:bg-black/90 backdrop-blur-md ' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <span className="ml-2 text-xl font-bold text-white dark:text-white">
                DoudAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-purple-400 ${
                    pathname === item.href ? 'text-purple-400' : 'text-white/90 dark:text-white/90'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <SimpleThemeToggle />
              <Link href="/signin">
                <Button variant="ghost" className="text-white dark:text-white hover:text-purple-400 hover:bg-white/10 dark:hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white dark:text-white hover:bg-white/10 dark:hover:bg-white/10"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 dark:bg-black/95 backdrop-blur-md border-t border-white/10 dark:border-white/10"
            >
              <div className="px-4 py-6 space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-base font-medium transition-colors hover:text-purple-400 ${
                      pathname === item.href ? 'text-purple-400' : 'text-white/90 dark:text-white/90'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-3">
                  <div className="flex justify-center">
                    <SimpleThemeToggle />
                  </div>
                  <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-white dark:text-white hover:bg-white/10 dark:hover:bg-white/10">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
