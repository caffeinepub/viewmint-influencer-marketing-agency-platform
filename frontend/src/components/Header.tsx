import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/viewmint-logo-transparent.dim_200x200.png"
              alt="Viewmint"
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Viewmint
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  Portfolio
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  Contact
                </button>
              </>
            )}
            <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'}>
              {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/40">
            <div className="flex flex-col gap-4">
              {!isAuthenticated && (
                <>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors text-left"
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors text-left"
                  >
                    Services
                  </button>
                  <button
                    onClick={() => scrollToSection('portfolio')}
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors text-left"
                  >
                    Portfolio
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors text-left"
                  >
                    Contact
                  </button>
                </>
              )}
              <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'} className="w-full">
                {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
