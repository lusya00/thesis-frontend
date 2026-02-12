import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Anchor, User, Mail, Phone, MapPin, Globe, AlertCircle, Loader2, KeyRound, Eye, EyeOff, Sun, Waves, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import LoadingAnimation from "@/components/LoadingAnimation";
import Footer from "@/components/Footer";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import LanguageToggle from "@/components/LanguageToggle";
import { authService, SignupData } from "@/lib/services/authService";
import { createInputHandler, validateForm, sanitizeInput } from "@/lib/utils/validation";
import { useTranslation } from "@/hooks/useTranslation";

const SignupPage = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_number: "",
    country: "",
    address: "",
    passport: "",
    type: "user" as "user" | "guest"
  });
  
  const [formErrors, setFormErrors] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_number: "",
    country: "",
    address: "",
    passport: ""
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
    }, 1800);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Create input handlers with validation
  const handleNameChange = createInputHandler(
    'name',
    (value) => setFormData(prev => ({ ...prev, name: value })),
    (error) => setFormErrors(prev => ({ ...prev, name: error })),
    true
  );

  const handleLastNameChange = createInputHandler(
    'name',
    (value) => setFormData(prev => ({ ...prev, last_name: value })),
    (error) => setFormErrors(prev => ({ ...prev, last_name: error })),
    true
  );

  const handleEmailChange = createInputHandler(
    'email',
    (value) => setFormData(prev => ({ ...prev, email: value })),
    (error) => setFormErrors(prev => ({ ...prev, email: error })),
    true
  );

  const handlePhoneChange = createInputHandler(
    'phone',
    (value) => setFormData(prev => ({ ...prev, phone_number: value })),
    (error) => setFormErrors(prev => ({ ...prev, phone_number: error })),
    true
  );

  const handleAddressChange = createInputHandler(
    'alphanumeric',
    (value) => setFormData(prev => ({ ...prev, address: value })),
    undefined,
    false
  );

  const handlePassportChange = createInputHandler(
    'alphanumeric',
    (value) => setFormData(prev => ({ ...prev, passport: value })),
    undefined,
    false
  );

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, password: value }));
    
    // Password validation
    if (value.length > 0 && value.length < 6) {
      setFormErrors(prev => ({ ...prev, password: t('auth.password_min_length') }));
    } else {
      setFormErrors(prev => ({ ...prev, password: "" }));
    }

    // Check password confirmation match if it exists
    if (formData.password_confirmation && value !== formData.password_confirmation) {
      setFormErrors(prev => ({ ...prev, password_confirmation: t('auth.password_mismatch') }));
    } else if (formData.password_confirmation) {
      setFormErrors(prev => ({ ...prev, password_confirmation: "" }));
    }
  };

  const handlePasswordConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, password_confirmation: value }));
    
    // Check if passwords match
    if (value && value !== formData.password) {
      setFormErrors(prev => ({ ...prev, password_confirmation: t('auth.password_mismatch') }));
    } else {
      setFormErrors(prev => ({ ...prev, password_confirmation: "" }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const validation = validateForm({
      name: { value: formData.name, type: 'name', required: true },
      last_name: { value: formData.last_name, type: 'name', required: true },
      email: { value: formData.email, type: 'email', required: true },
      phone_number: { value: formData.phone_number, type: 'phone', required: true }
    });

    // Add custom password validation
    if (!formData.password) {
      validation.errors.password = t('auth.required_field');
      validation.isValid = false;
    } else if (formData.password.length < 6) {
      validation.errors.password = t('auth.password_min_length');
      validation.isValid = false;
    }

    if (!formData.password_confirmation) {
      validation.errors.password_confirmation = t('auth.required_field');
      validation.isValid = false;
    } else if (formData.password !== formData.password_confirmation) {
      validation.errors.password_confirmation = t('auth.password_mismatch');
      validation.isValid = false;
    }

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
      // Prepare signup data for the API
      const signupData: SignupData = {
        name: formData.name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
        country: formData.country || undefined,
        address: formData.address || undefined,
        passport: formData.passport || undefined,
        type: formData.type,
      };
      
      // Call the auth service to register
      const response = await authService.signup(signupData);
      
      if (response.status === 'success' && response.data) {
        toast({
          title: "Registration successful!",
          description: "Welcome to Untung Jawa Island.",
        });
        
        navigate("/");
      } else {
        // Handle registration failure
        setFormError(response.message || "Failed to create your account. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setFormError("There was a problem creating your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (token: string, isNew: boolean) => {
    // Token is already stored by the OAuth service
    toast({
      title: "Welcome to Untung Jawa!",
      description: "Your account has been created successfully with Google.",
    });
    
    navigate("/user/dashboard");
  };

  const handleGoogleError = (error: string) => {
    toast({
      title: "Google Sign-Up Failed",
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

        <div className="flex-1 flex items-center justify-center px-4 py-12 pt-32">
          <motion.div 
            className="max-w-lg w-full space-y-6"
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
                  
                  <h2 className="text-3xl font-bold text-ocean-dark font-playfair">{t('auth.signup_title')}</h2>
                  <p className="text-muted-foreground mt-2">{t('auth.signup_subtitle')}</p>
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

                {/* Google Sign-Up Button */}
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
                      <span className="px-4 bg-white text-gray-500">Or sign up with email</span>
                    </div>
                  </div>
                </motion.div>

                {/* Form */}
                <motion.form 
                  onSubmit={onSubmit}
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: contentLoaded ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {/* Name fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        {t('auth.full_name')} *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleNameChange}
                          className={`pl-10 rounded-xl border-gray-200 focus:border-ocean focus:ring-ocean ${
                            formErrors.name ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                          placeholder={t('auth.name_placeholder')}
                        />
                      </div>
                      {formErrors.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-red-500 text-sm"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{formErrors.name}</span>
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                        Last Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="last_name"
                          name="last_name"
                          type="text"
                          required
                          value={formData.last_name}
                          onChange={handleLastNameChange}
                          className={`pl-10 rounded-xl border-gray-200 focus:border-ocean focus:ring-ocean ${
                            formErrors.last_name ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                          placeholder="Last name"
                        />
                      </div>
                      {formErrors.last_name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-red-500 text-sm"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{formErrors.last_name}</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                                          <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      {t('auth.email')} *
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

                  {/* Phone number */}
                  <div className="space-y-2">
                    <label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
                      {t('auth.phone')} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        required
                        value={formData.phone_number}
                        onChange={handlePhoneChange}
                        className={`pl-10 rounded-xl border-gray-200 focus:border-ocean focus:ring-ocean ${
                          formErrors.phone_number ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        placeholder={t('auth.phone_placeholder')}
                      />
                    </div>
                    {formErrors.phone_number && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-red-500 text-sm"
                      >
                        <AlertCircle className="h-3 w-3" />
                        <span>{formErrors.phone_number}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Password fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        {t('auth.password')} *
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

                    <div className="space-y-2">
                      <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                        {t('auth.confirm_password')} *
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="password_confirmation"
                          name="password_confirmation"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={formData.password_confirmation}
                          onChange={handlePasswordConfirmationChange}
                          className={`pl-10 pr-10 rounded-xl border-gray-200 focus:border-ocean focus:ring-ocean ${
                            formErrors.password_confirmation ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                          placeholder={t('auth.confirm_password_placeholder')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {formErrors.password_confirmation && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-red-500 text-sm"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{formErrors.password_confirmation}</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Optional fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="country" className="text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                          <SelectTrigger className="pl-10 rounded-xl border-gray-200 focus:border-ocean focus:ring-ocean">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="indonesia">Indonesia</SelectItem>
                            <SelectItem value="singapore">Singapore</SelectItem>
                            <SelectItem value="malaysia">Malaysia</SelectItem>
                            <SelectItem value="thailand">Thailand</SelectItem>
                            <SelectItem value="philippines">Philippines</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="address" className="text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleAddressChange}
                            className="pl-10 rounded-xl border-gray-200 focus:border-ocean focus:ring-ocean"
                            placeholder="Your address"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Passport */}
                    <div className="space-y-2">
                      <label htmlFor="passport" className="text-sm font-medium text-gray-700">
                        Passport Number
                      </label>
                      <Input
                        id="passport"
                        name="passport"
                        type="text"
                        value={formData.passport}
                        onChange={handlePassportChange}
                        className="rounded-xl border-gray-200 focus:border-ocean focus:ring-ocean"
                        placeholder="Passport number (optional)"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <motion.div className="pt-6" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-ocean to-ocean-dark hover:from-ocean-dark hover:to-cyan-800 text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </motion.div>

                  {/* Login link */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link to="/login" className="text-ocean hover:text-ocean-dark font-medium">
                        Sign in here
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

export default SignupPage;
