import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Anchor, Mail, KeyRound, AlertCircle, Loader2, Eye, EyeOff, Sun, Waves } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import LoadingAnimation from "@/components/LoadingAnimation";
import Footer from "@/components/Footer";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import LanguageToggle from "@/components/LanguageToggle";
import { authService } from "@/lib/services/authService";
import { createInputHandler, validateForm } from "@/lib/utils/validation";
import { useTranslation } from "@/hooks/useTranslation";

const LoginPage = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: ""
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      // User is already logged in, redirect to dashboard
      navigate('/user/dashboard');
      return;
    }
  }, [navigate]);

  // Page loading effect
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setPageLoading(false);
      setTimeout(() => setContentLoaded(true), 300);
    }, 1500);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Create input handlers with validation
  const handleEmailChange = createInputHandler(
    'email',
    (value) => setFormData(prev => ({ ...prev, email: value })),
    (error) => setFormErrors(prev => ({ ...prev, email: error })),
    true
  );

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, password: value }));
    
    if (value.length > 0 && value.length < 6) {
      setFormErrors(prev => ({ ...prev, password: t('auth.password_min_length') }));
    } else {
      setFormErrors(prev => ({ ...prev, password: "" }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    const validation = validateForm({
      email: { value: formData.email, type: 'email', required: true },
      password: { value: formData.password, type: 'password', required: true }
    });

    if (!validation.isValid) {
      setFormErrors({
        ...formErrors,
        ...validation.errors
      });
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setFormError("");
    
    try {
      const response = await authService.login(formData);
      
      if (response.status === 'success' && response.data) {
        toast({
          title: t('auth.login_success'),
          description: "Welcome back to Untung Jawa Island.",
        });
        
        navigate("/");
      } else {
        // Handle authentication failure
        setFormError(response.message || t('auth.invalid_credentials'));
      }
    } catch (error) {
      console.error("Login error:", error);
      setFormError("An error occurred during login. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (token: string, isNew: boolean) => {
    // Token is already stored by the OAuth service
    toast({
      title: isNew ? "Welcome to Untung Jawa!" : "Welcome back!",
      description: isNew ? t('auth.signup_success') : t('auth.login_success'),
    });
    
    navigate("/user/dashboard");
  };

  const handleGoogleError = (error: string) => {
    toast({
      title: "Google Sign-In Failed",
      description: error,
      variant: "destructive"
    });
  };

  return (
    <>
      <LoadingAnimation 
        isLoading={pageLoading} 
        onComplete={() => setContentLoaded(true)}
      />
      
      <motion.div 
        className="min-h-screen flex flex-col bg-gradient-to-br from-ocean-light/20 via-sand-light/30 to-tropical-light/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: contentLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <EnhancedNavbar />

        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 35, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-br from-sand-light/15 to-sand-dark/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.15, 1],
            }}
            transition={{
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-1/2 right-20 w-32 h-32 bg-gradient-to-br from-tropical/8 to-sand-light/8 rounded-full blur-2xl"
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 pt-32">
          <motion.div 
            className="max-w-md w-full space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Form card */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 overflow-hidden">
              {/* Animated decorative elements */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-16 -left-16 w-32 h-32 bg-gradient-to-br from-ocean/20 to-tropical/20 rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-br from-sand-light/20 to-sand-dark/20 rounded-full"
              />
              
              <div className="relative z-10">
                {/* Header with animated logo */}
                <motion.div 
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex items-center justify-center mb-6">
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative"
                    >
                      <div className="p-4 bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-2xl">
                        <Anchor className="w-8 h-8 text-ocean" />
                      </div>
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute -top-1 -right-1"
                      >
                        <Sun className="w-6 h-6 text-sand-dark" />
                      </motion.div>
                      <motion.div
                        animate={{ 
                          x: [0, 5, -5, 0],
                          opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: 0.5
                        }}
                        className="absolute -bottom-1 -left-1"
                      >
                        <Waves className="w-4 h-4 text-ocean/60" />
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-ocean-dark font-playfair">{t('auth.login_title')}</h2>
                  <p className="text-muted-foreground mt-2">{t('auth.login_subtitle')}</p>
                </motion.div>
                
                {/* Error message */}
                <AnimatePresence>
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6"
                    >
                      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="text-red-700 text-sm">{formError}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Google Sign-In Button */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : 10 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <GoogleSignInButton
                    userType="landing"
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    disabled={isLoading}
                    className="w-full mb-4"
                    size="lg"
                  />
                  
                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                    </div>
                  </div>
                </motion.div>

                {/* Form */}
                <motion.form 
                  onSubmit={onSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: contentLoaded ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      {t('auth.email')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleEmailChange}
                        className={`pl-10 rounded-xl border-gray-200 focus:border-ocean focus:ring-ocean ${
                          formErrors.email ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        placeholder={t('auth.email_placeholder')}
                      />
                    </div>
                    {formErrors.email && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-red-500 text-sm"
                      >
                        <AlertCircle className="h-3 w-3" />
                        <span>{formErrors.email}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Password field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      {t('auth.password')}
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handlePasswordChange}
                        className={`pl-10 pr-10 rounded-xl border-gray-200 focus:border-ocean focus:ring-ocean ${
                          formErrors.password ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        placeholder={t('auth.password_placeholder')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-red-500 text-sm"
                      >
                        <AlertCircle className="h-3 w-3" />
                        <span>{formErrors.password}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Submit button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-ocean to-ocean-dark hover:from-ocean-dark hover:to-cyan-800 text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('auth.signing_in')}
                        </div>
                      ) : (
                        t('auth.login_button')
                      )}
                    </Button>
                  </motion.div>

                  {/* Additional links */}
                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600">
                      {t('auth.no_account')}{" "}
                      <Link to="/signup" className="text-ocean hover:text-ocean-dark font-medium">
                        {t('auth.sign_up_link')}
                      </Link>
                    </p>
                  </div>
                </motion.form>
              </div>
            </div>
          </motion.div>
        </div>
        
        <Footer />
      </motion.div>
    </>
  );
};

export default LoginPage;
