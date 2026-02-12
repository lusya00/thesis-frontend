import LanguageToggle from "@/components/LanguageToggle";
import { useTranslation } from "@/hooks/useTranslation";
import { debugLog } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Anchor,
  Building,
  Calendar,
  ChevronDown,
  Home,
  Info,
  LogOut,
  MapPin,
  Menu,
  Settings,
  Sun,
  UserRound,
  Waves,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/services/authService";

const EnhancedNavbar = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
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
    {
      name: t('nav.home'),
      href: "/",
      icon: Home,
      description: "Welcome to paradise"
    },
    {
      name: t('nav.about'),
      href: "/about",
      icon: Info,
      description: "Our island story"
    },
    {
      name: t('nav.homestays'),
      href: "/homestays",
      icon: Building,
      description: "Authentic accommodations"
    },
    {
      name: t('nav.activities'),
      href: "/activities",
      icon: Activity,
      description: "Island adventures"
    }
  ];

  const isActivePage = (href: string) => {
    if (href.startsWith('#')) return false;
    return location.pathname === href;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 min-h-[64px] ${
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-lg border-b border-ocean/10 py-2"
            : "bg-gradient-to-b from-black/50 via-black/20 to-transparent backdrop-blur-sm py-3 sm:py-4"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex justify-between items-center min-h-[60px]">
            
            {/* Enhanced Logo */}
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                {/* Logo background with island theme */}
                <motion.div 
                  className={`relative p-3 rounded-2xl transition-all duration-500 ${
                    isScrolled 
                      ? "bg-gradient-to-br from-ocean/10 to-tropical/10 border border-ocean/20" 
                      : "bg-white/10 backdrop-blur-sm border border-white/30"
                  }`}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Anchor className={`h-7 w-7 ${
                    isScrolled ? "text-ocean" : "text-white"
                  } transition-all duration-500 group-hover:rotate-12`} />
                  
                  {/* Floating sun accent - Simplified */}
                  <div className="absolute -top-1 -right-1">
                    <Sun className={`h-4 w-4 ${
                      isScrolled ? "text-sand-dark" : "text-sand-light"
                    } transition-colors duration-500`} />
                  </div>
                  
                  {/* Wave effect */}
                  <motion.div
                    animate={{ 
                      x: [0, 10, 0],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="absolute -bottom-1 -left-1"
                  >
                    <Waves className={`h-3 w-3 ${
                      isScrolled ? "text-ocean/50" : "text-white/50"
                    } transition-colors duration-500`} />
                  </motion.div>
                </motion.div>
              </div>
              
              <div className="flex flex-col">
                <motion.span 
                  className={`text-xl sm:text-2xl md:text-3xl font-bold font-playfair ${
                    isScrolled ? "text-ocean-dark" : "text-white text-shadow-dark"
                  } tracking-wider transition-all duration-500`}
                  whileHover={{ letterSpacing: "0.2em" }}
                  transition={{ duration: 0.3 }}
                >
                  Untung Jawa
                </motion.span>
                <span className={`text-xs sm:text-xs md:text-sm ${
                  isScrolled ? "text-ocean/80" : "text-sand-light text-shadow-soft"
                } font-medium -mt-1 tracking-widest transition-all duration-500`}>
                  Island Paradise
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isActivePage(link.href);
                
                return (
                  <motion.div
                    key={link.name}
                    whileHover={{ y: -2 }}
                    onHoverStart={() => setActiveDropdown(link.name)}
                    onHoverEnd={() => setActiveDropdown(null)}
                    className="relative"
                  >
                    <Link
                      to={link.href.startsWith('#') ? `/${link.href}` : link.href}
                      className={`relative px-4 py-3 rounded-xl transition-all duration-300 font-medium group flex items-center space-x-2 ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white border border-cyan-300/30" 
                          : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="relative z-10">{link.name}</span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className={`absolute bottom-0 left-4 right-4 h-0.5 ${
                            isScrolled ? "bg-ocean" : "bg-white"
                          } rounded-full`}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      
                      {/* Hover tooltip */}
                      <AnimatePresence>
                        {activeDropdown === link.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-lg rounded-lg px-3 py-2 text-sm text-gray-700 shadow-xl border border-gray-100 whitespace-nowrap z-50"
                          >
                            {link.description}
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/95 border-l border-t border-gray-100 rotate-45" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="hidden lg:flex items-center space-x-4 ml-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-300 focus:outline-none ${
                        isScrolled 
                          ? "hover:bg-ocean/10 border border-transparent hover:border-ocean/30" 
                          : "hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40"
                      }`}
                    >
                      <Avatar className="h-9 w-9 ring-2 ring-white/30">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.first_name || user.email || 'User')}&background=0D8ABC&color=fff`} />
                        <AvatarFallback className="bg-ocean text-white">
                          <UserRound className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className={`${isScrolled ? "text-ocean-dark" : "text-white text-shadow-soft"} hidden sm:inline-block font-medium`}>
                        {user.name ? user.name.split(' ')[0] : (user.first_name || user.last_name || 'User')}
                      </span>
                      <ChevronDown className={`h-4 w-4 ${isScrolled ? "text-ocean-dark" : "text-white"}`} />
                    </motion.button>
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                      "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500"
                    }`}
                  >
                    <UserRound size={18} />
                    <span>{t('nav.login')}</span>
                  </Link>
                </motion.div>
              )}
              
              {/* Language Toggle */}
              <LanguageToggle variant="navbar" />
              
              {/* Enhanced Book Now Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link
                  to="/homestays"
                  className={`relative overflow-hidden group inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                    isScrolled 
                      ? "bg-gradient-to-r from-ocean to-ocean-dark text-white hover:from-ocean-dark hover:to-ocean" 
                      : "bg-white/90 backdrop-blur-sm text-ocean-dark hover:bg-white border border-white/30"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <MapPin className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
{t('hero.explore_homestays')}
                  </span>
                  
                  {/* Animated shimmer effect */}
                  <motion.div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isScrolled 
                        ? "bg-gradient-to-r from-transparent via-white/20 to-transparent" 
                        : "bg-gradient-to-r from-transparent via-ocean/20 to-transparent"
                    }`}
                    animate={{ x: [-100, 200] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                  />
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`lg:hidden p-3 min-h-[44px] min-w-[44px] rounded-xl transition-all duration-300 flex items-center justify-center ${
                isScrolled 
                  ? "text-ocean-dark hover:bg-ocean/10" 
                  : "text-white hover:bg-white/10 backdrop-blur-sm"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Enhanced Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden fixed top-[76px] sm:top-[84px] left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl border-b border-ocean/10 z-40 max-h-[calc(100vh-76px)] sm:max-h-[calc(100vh-84px)] overflow-y-auto"
          >
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
              
              {/* Mobile Navigation Links */}
              <div className="space-y-2 mb-6">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = isActivePage(link.href);
                  
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.href.startsWith('#') ? `/${link.href}` : link.href}
                        className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-ocean/10 text-ocean border-l-4 border-ocean"
                            : "text-ocean-dark hover:text-ocean hover:bg-ocean/5 border-l-4 border-transparent"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <div className="flex-1">
                          <div className="font-medium">{link.name}</div>
                          <div className="text-sm text-gray-500">{link.description}</div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile User Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="border-t border-gray-200 pt-6"
              >
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/user/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-ocean-dark hover:bg-ocean/5 transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserRound size={18} />
                      <span>My Dashboard</span>
                    </Link>
                    <Link
                      to="/user/bookings"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-ocean-dark hover:bg-ocean/5 transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Calendar size={18} />
                      <span>My Bookings</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left"
                    >
                      <LogOut size={18} />
                      <span>Log out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-ocean-dark hover:bg-ocean/5 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserRound size={18} />
                    <span>{t('nav.login')}</span>
                  </Link>
                )}
                
                {/* Language Toggle */}
                <div className="mt-4 mb-2">
                  <LanguageToggle variant="default" className="w-full justify-center" />
                </div>
                
                {/* Mobile Book Now Button */}
                <Link
                  to="/homestays"
                  className="flex items-center justify-center space-x-2 w-full mt-4 px-6 py-4 bg-gradient-to-r from-ocean to-ocean-dark text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MapPin size={18} />
                  <span>{t('hero.explore_homestays')}</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedNavbar; 