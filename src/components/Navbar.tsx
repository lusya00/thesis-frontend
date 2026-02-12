import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Anchor, Sun, MapPin, UserRound, LogOut, Settings, Calendar, ChevronDown } from "lucide-react";
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authService } from "@/lib/services/authService";
import { useToast } from "@/hooks/use-toast";
import { debugLog } from '../lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    // Listen for storage changes (when user logs in/out via OAuth)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jwt_token' || e.key === 'user') {
        debugLog('[NAVBAR] Storage changed, rechecking user authentication');
        const updatedUser = authService.getCurrentUser();
        setUser(updatedUser);
      }
    };
    
    // Listen for custom auth events
    const handleAuthChange = (e: Event) => {
      debugLog('[NAVBAR] Auth change event received');
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-changed', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    
    // Dispatch auth change event
    window.dispatchEvent(new Event('auth-changed'));
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Homestays", href: "/homestays" },
    { name: "Activities", href: "/activities" },
    { name: "Map", href: "#map" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-xl border-b border-ocean/10 py-2"
          : "bg-gradient-to-b from-black/40 via-black/20 to-transparent backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className={`p-2 rounded-full transition-all duration-300 ${
              isScrolled 
                ? "bg-ocean/10" 
                : "bg-white/10 backdrop-blur-sm border border-white/20"
            }`}>
              <Anchor className={`h-6 w-6 ${
                isScrolled ? "text-ocean" : "text-white"
              } transition-all duration-300 group-hover:rotate-12`} />
            </div>
            <Sun className={`h-3 w-3 absolute -top-1 -right-1 ${
              isScrolled ? "text-ocean-dark" : "text-sand-light"
            } transition-all duration-300 group-hover:scale-125`} />
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-bold font-playfair ${
              isScrolled ? "text-ocean-dark" : "text-white text-shadow-dark"
            } tracking-wider transition-all duration-300`}>
              Untung Jawa
            </span>
            <span className={`text-xs ${
              isScrolled ? "text-ocean" : "text-sand-light text-shadow-soft"
            } font-medium -mt-1 transition-all duration-300`}>
              Island Paradise
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href.startsWith('#') ? `/${link.href}` : link.href}
              className={`relative px-3 py-2 rounded-lg transition-all duration-300 font-medium group ${
                isScrolled 
                  ? "text-ocean-dark hover:text-ocean hover:bg-ocean/5" 
                  : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm drop-shadow-sm"
              }`}
            >
              <span className="relative z-10">{link.name}</span>
              <span className={`absolute bottom-0 left-3 right-3 h-0.5 ${
                isScrolled ? "bg-ocean" : "bg-white"
              } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
            </Link>
          ))}
        </div>

        {/* Login/Signup or User Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 focus:outline-none ${
                isScrolled 
                  ? "hover:bg-ocean/5" 
                  : "hover:bg-white/10 backdrop-blur-sm"
              }`}>
                <Avatar className="h-8 w-8 ring-2 ring-white/20">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.first_name || user.email || 'User')}&background=0D8ABC&color=fff`} />
                  <AvatarFallback className="bg-ocean text-white">
                    <UserRound className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className={`${isScrolled ? "text-ocean-dark" : "text-white text-shadow-soft"} hidden sm:inline-block font-medium`}>
                  {user.name ? user.name.split(' ')[0] : (user.first_name || user.last_name || 'User')}
                </span>
                <ChevronDown className={`h-4 w-4 ${isScrolled ? "text-ocean-dark" : "text-white"}`} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-lg border border-ocean/10 shadow-xl">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/user/dashboard')}>
                  <UserRound className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/user/bookings')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>My Bookings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/user/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                isScrolled 
                  ? "text-ocean-dark hover:text-ocean hover:bg-ocean/5" 
                  : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm drop-shadow-sm"
              }`}
            >
              <UserRound size={18} />
              <span>Login</span>
            </Link>
          )}
          
          <Link
            to="/book"
            className={`relative overflow-hidden group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              isScrolled 
                ? "bg-gradient-to-r from-ocean to-ocean-dark text-white hover:from-ocean-dark hover:to-cyan-800" 
                : "bg-white/90 backdrop-blur-sm text-ocean-dark hover:bg-white border border-white/20"
            }`}
          >
            <span className="relative z-10">Book Now</span>
            <MapPin className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            <span className={`absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              isScrolled 
                ? "bg-gradient-to-r from-ocean-dark to-cyan-800" 
                : "bg-gradient-to-r from-white to-sand-light"
            }`}></span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
            isScrolled 
              ? "text-ocean-dark hover:bg-ocean/5" 
              : "text-white hover:bg-white/10 backdrop-blur-sm"
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
        >
          {mobileMenuOpen ? (
            <X size={24} className="transition-all duration-300 hover:rotate-90" />
          ) : (
            <Menu size={24} className="transition-all duration-300 hover:scale-110" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden bg-white/95 backdrop-blur-lg absolute top-full left-0 w-full shadow-xl border-t border-ocean/10 py-6 px-4 animate-slideDown">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href.startsWith('#') ? `/${link.href}` : link.href}
                className="text-ocean-dark hover:text-ocean font-medium flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-ocean/5 transition-all duration-200 border-l-4 border-transparent hover:border-ocean"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.name}</span>
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  to="/user/dashboard"
                  className="text-ocean-dark hover:text-ocean font-medium flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-ocean/5 transition-all duration-200 border-l-4 border-transparent hover:border-ocean"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserRound size={18} />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-all duration-200 border-l-4 border-transparent hover:border-red-600 text-left w-full"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-ocean-dark hover:text-ocean font-medium flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-ocean/5 transition-all duration-200 border-l-4 border-transparent hover:border-ocean"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserRound size={18} />
                <span>Login</span>
              </Link>
            )}
            
            <Link
              to="/book"
              className="bg-gradient-to-r from-ocean to-ocean-dark text-white px-6 py-3 rounded-full font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
