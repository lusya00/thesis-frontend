import React, { useState } from "react";
import EnhancedNavbar from "../components/EnhancedNavbar";
import Footer from "../components/Footer";
import LanguageToggle from "../components/LanguageToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare, 
  Users, 
  Calendar,
  Anchor,
  Waves,
  TreePalm,
  Star,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Compass,
  Headphones,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { createInputHandler, validateForm, formatInput } from "@/lib/utils/validation";
import { useTranslation } from "@/hooks/useTranslation";

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: ""
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Create input handlers with validation
  const handleNameChange = createInputHandler(
    'name',
    (value) => setFormData(prev => ({ ...prev, name: value })),
    (error) => setFormErrors(prev => ({ ...prev, name: error })),
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
    (value) => setFormData(prev => ({ ...prev, phone: value })),
    (error) => setFormErrors(prev => ({ ...prev, phone: error })),
    false
  );

  const handleSubjectChange = createInputHandler(
    'subject',
    (value) => setFormData(prev => ({ ...prev, subject: value })),
    (error) => setFormErrors(prev => ({ ...prev, subject: error })),
    true
  );

  const handleMessageChange = createInputHandler(
    'message',
    (value) => setFormData(prev => ({ ...prev, message: value })),
    (error) => setFormErrors(prev => ({ ...prev, message: error })),
    true
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const validation = validateForm({
      name: { value: formData.name, type: 'name', required: true },
      email: { value: formData.email, type: 'email', required: true },
      phone: { value: formData.phone, type: 'phone', required: false },
      subject: { value: formData.subject, type: 'subject', required: true },
      message: { value: formData.message, type: 'message', required: true }
    });

    if (!validation.isValid) {
      setFormErrors(prev => ({
        ...prev,
        ...validation.errors
      }));
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 24 hours. Thank you for contacting us!",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: ""
    });
    setFormErrors({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-ocean" />,
      titleKey: "contact.address",
      details: [t('contact.address_value').split(', ')[0], t('contact.address_value').split(', ')[1], t('contact.address_value').split(', ')[2]],
      gradient: "from-blue-500/10 to-ocean/10"
    },
    {
      icon: <Phone className="h-6 w-6 text-ocean" />,
      titleKey: "contact.phone",
      details: [t('contact.phone_value'), "+62 821-9876-5432", "Available 24/7"],
      gradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: <Mail className="h-6 w-6 text-ocean" />,
      titleKey: "contact.email",
      details: [t('contact.email_value'), "booking@untungjawa.com", "support@untungjawa.com"],
      gradient: "from-orange-500/10 to-red-500/10"
    },
    {
      icon: <Clock className="h-6 w-6 text-ocean" />,
      titleKey: "contact.hours",
      details: [t('contact.hours_value'), "Boat Schedule: 8:00 AM - 5:00 PM", t('contact.emergency') + ": " + t('contact.emergency_value')],
      gradient: "from-purple-500/10 to-pink-500/10"
    }
  ];

  const inquiryTypes = [
    { value: "booking", label: "Homestay Booking", icon: <Anchor className="h-4 w-4" /> },
    { value: "activities", label: "Activities & Tours", icon: <Waves className="h-4 w-4" /> },
    { value: "transportation", label: "Transportation", icon: <Compass className="h-4 w-4" /> },
    { value: "group", label: "Group Booking", icon: <Users className="h-4 w-4" /> },
    { value: "support", label: "General Support", icon: <Headphones className="h-4 w-4" /> },
    { value: "other", label: "Other Inquiry", icon: <MessageSquare className="h-4 w-4" /> }
  ];

  const socialLinks = [
    { icon: <Instagram className="h-5 w-5" />, name: "Instagram", url: "#", color: "hover:text-pink-500" },
    { icon: <Facebook className="h-5 w-5" />, name: "Facebook", url: "#", color: "hover:text-blue-500" },
    { icon: <Twitter className="h-5 w-5" />, name: "Twitter", url: "#", color: "hover:text-sky-500" },
    { icon: <Globe className="h-5 w-5" />, name: "Website", url: "#", color: "hover:text-green-500" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-light/20 via-sand-light/30 to-tropical-light/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 80, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-96 -right-96 w-[1000px] h-[1000px] bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 65, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-96 -left-96 w-[1200px] h-[1200px] bg-gradient-to-br from-sand-light/15 to-sand-dark/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: 180,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 50, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-tropical/5 to-ocean/5 rounded-full blur-3xl"
        />
      </div>

      <EnhancedNavbar />
      
      {/* Enhanced Hero Section */}
      <section className="relative py-32 text-white overflow-hidden">
        <div className="absolute inset-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80" 
            alt="Contact us" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-dark/95 via-ocean/80 to-tropical/90"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-sand/90 backdrop-blur-md text-ocean-dark mb-6 px-6 py-2 text-sm font-medium rounded-full">
              {t('contact.subtitle')}
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-playfair mb-8 leading-tight">
              {t('contact.title').split(' ')[0]}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sand to-sand-light">
                {t('contact.title').split(' ')[1] || 'Paradise'}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-sand-light/90 max-w-4xl mx-auto leading-relaxed mb-10">
              {t('contact.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  className="bg-white hover:bg-white/90 text-ocean-dark font-bold rounded-2xl px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Us a Message
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-ocean-dark backdrop-blur-md rounded-2xl px-8 py-4 font-bold transition-all duration-300"
                  onClick={() => document.getElementById('contact-info')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Information
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-32 relative z-10">
        
        {/* Contact Information Section */}
        <motion.section 
          id="contact-info"
          className="mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <div className="inline-flex items-center mb-6">
              <MessageSquare className="text-ocean h-8 w-8 mr-3" />
              <span className="text-ocean font-semibold uppercase tracking-wider">How to Reach Us</span>
              <TreePalm className="text-ocean h-8 w-8 ml-3" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-ocean-dark mb-6 font-playfair">
              Contact 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-ocean to-tropical">
                Information
              </span>
            </h2>
            <p className="text-xl text-ocean/70 max-w-3xl mx-auto leading-relaxed">
              Multiple ways to connect with our island paradise team for bookings, inquiries, and support
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className={`relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 overflow-hidden h-full`}>
                  {/* Decorative gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-ocean/10 to-tropical/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {info.icon}
                    </div>
                    <h4 className="font-bold text-ocean-dark text-xl mb-4 font-playfair">
                      {t(info.titleKey)}
                    </h4>
                    <div className="space-y-2">
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-ocean/70 text-sm leading-relaxed">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Form Section */}
        <motion.section 
          id="contact-form"
          className="mb-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Form Column */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-ocean/10 to-tropical/10 rounded-2xl mb-4">
                    <Send className="h-8 w-8 text-ocean" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4 font-playfair">
                    {t('contact.form_title')}
                  </h3>
                  <p className="text-ocean/70 leading-relaxed">
                    {t('contact.form_description')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Inquiry Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-ocean-dark mb-3">
                      {t('contact.inquiry_type')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {inquiryTypes.map((type) => (
                        <motion.button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, inquiryType: type.value }))}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 text-sm ${
                            formData.inquiryType === type.value
                              ? 'bg-gradient-to-r from-ocean to-tropical text-white border-transparent'
                              : 'bg-white/50 text-ocean-dark border-ocean/20 hover:border-ocean/40'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {type.icon}
                          <span>{type.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-ocean-dark mb-2">
                        {t('contact.name')} *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleNameChange}
                        className={`rounded-xl border-ocean/20 focus:border-ocean bg-white/80 backdrop-blur-sm ${
                          formErrors.name ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        placeholder={t('contact.name_placeholder')}
                      />
                      {formErrors.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 mt-1 text-red-500 text-sm"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{formErrors.name}</span>
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-ocean-dark mb-2">
                        {t('contact.email')} *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleEmailChange}
                        className={`rounded-xl border-ocean/20 focus:border-ocean bg-white/80 backdrop-blur-sm ${
                          formErrors.email ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        placeholder={t('contact.email_placeholder')}
                      />
                      {formErrors.email && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 mt-1 text-red-500 text-sm"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{formErrors.email}</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Phone and Subject Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-ocean-dark mb-2">
                        {t('contact.phone')}
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`rounded-xl border-ocean/20 focus:border-ocean bg-white/80 backdrop-blur-sm ${
                          formErrors.phone ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        placeholder={t('contact.phone_placeholder')}
                      />
                      {formErrors.phone && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 mt-1 text-red-500 text-sm"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{formErrors.phone}</span>
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-ocean-dark mb-2">
                        {t('contact.subject')} *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleSubjectChange}
                        className={`rounded-xl border-ocean/20 focus:border-ocean bg-white/80 backdrop-blur-sm ${
                          formErrors.subject ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        placeholder={t('contact.subject_placeholder')}
                      />
                      {formErrors.subject && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 mt-1 text-red-500 text-sm"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{formErrors.subject}</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-ocean-dark mb-2">
                      {t('contact.message')} *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleMessageChange}
                      className={`rounded-xl border-ocean/20 focus:border-ocean bg-white/80 backdrop-blur-sm resize-none ${
                        formErrors.message ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      placeholder={t('contact.message_placeholder')}
                    />
                    {formErrors.message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 mt-1 text-red-500 text-sm"
                      >
                        <AlertCircle className="h-3 w-3" />
                        <span>{formErrors.message}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-ocean to-tropical hover:from-tropical hover:to-ocean text-white font-semibold rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2 h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <Send className="mr-2 h-5 w-5" />
                      )}
                      {isSubmitting ? t('contact.sending') : t('contact.send_message')}
                    </Button>
                  </motion.div>
                </form>
              </div>
            </div>

            {/* Information Column */}
            <div className="space-y-8">
              
              {/* Quick Response Info */}
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-12 translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl mb-4">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-ocean-dark mb-3 font-playfair">{t('contact.quick_response')}</h4>
                  <p className="text-ocean/70 text-sm leading-relaxed">
                    {t('contact.response_description')}
                  </p>
                </div>
              </div>

              {/* Booking Assistance */}
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-ocean/10 rounded-full -translate-y-12 translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500/10 to-ocean/10 rounded-2xl mb-4">
                    <Calendar className="h-6 w-6 text-ocean" />
                  </div>
                  <h4 className="text-xl font-bold text-ocean-dark mb-3 font-playfair">{t('contact.booking_assistance')}</h4>
                  <p className="text-ocean/70 text-sm leading-relaxed mb-4">
                    {t('contact.assistance_description')}
                  </p>
                  <ul className="text-ocean/70 text-sm space-y-1">
                    <li>• {t('contact.assistance_homestay')}</li>
                    <li>• {t('contact.assistance_activities')}</li>
                    <li>• {t('contact.assistance_transport')}</li>
                    <li>• {t('contact.assistance_groups')}</li>
                  </ul>
                </div>
              </div>

              {/* Social Media */}
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -translate-y-12 translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl mb-4">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-bold text-ocean-dark mb-3 font-playfair">{t('contact.follow_us')}</h4>
                  <p className="text-ocean/70 text-sm leading-relaxed mb-4">
                    {t('contact.social_description')}
                  </p>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        className={`p-3 bg-gradient-to-r from-ocean/10 to-tropical/10 rounded-xl text-ocean-dark transition-all duration-200 ${social.color}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Map/Location Section */}
        <motion.section 
          className="mb-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-sand-light/20 to-sand-dark/20 rounded-full translate-y-20 -translate-x-20"></div>
            
            <div className="relative z-10 p-8 md:p-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-ocean/10 to-tropical/10 rounded-2xl mb-6">
                  <MapPin className="h-8 w-8 text-ocean" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4 font-playfair">
                  Find Us in Paradise
                </h3>
                <p className="text-xl text-ocean/70 max-w-2xl mx-auto leading-relaxed">
                  Located in the heart of Jakarta's Thousand Islands, just a short boat ride from the bustling capital
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map Placeholder */}
                <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg h-96 bg-gradient-to-br from-ocean/10 to-tropical/10">
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl mb-4">
                        <Compass className="h-12 w-12 text-ocean" />
                      </div>
                      <h4 className="text-xl font-bold text-ocean-dark mb-2 font-playfair">Interactive Map</h4>
                      <p className="text-ocean/70">
                        Detailed location map with boat routes and nearby landmarks would be integrated here
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Location Details */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-ocean/5 to-transparent p-6 rounded-2xl">
                    <h5 className="font-bold text-ocean-dark mb-3">Getting There</h5>
                    <div className="space-y-2 text-sm text-ocean/70">
                      <p>🚢 Boat from Marina Ancol</p>
                      <p>⏱️ 45-60 minutes journey</p>
                      <p>🎫 Boat tickets available daily</p>
                      <p>📍 GPS: -5.6455, 106.6333</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-tropical/5 to-transparent p-6 rounded-2xl">
                    <h5 className="font-bold text-ocean-dark mb-3">What to Bring</h5>
                    <div className="space-y-2 text-sm text-ocean/70">
                      <p>🆔 Valid ID for boat boarding</p>
                      <p>☀️ Sunscreen and hat</p>
                      <p>👙 Swimwear and towel</p>
                      <p>📱 Waterproof phone case</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-sand-light/10 to-transparent p-6 rounded-2xl">
                    <h5 className="font-bold text-ocean-dark mb-3">Best Time to Visit</h5>
                    <div className="space-y-2 text-sm text-ocean/70">
                      <p>🌤️ Dry season: April - October</p>
                      <p>🌊 Calm seas: Early morning</p>
                      <p>🌅 Sunset views: Evening boat</p>
                      <p>👥 Less crowds: Weekdays</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Emergency Contact */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="relative bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-red-200/50 shadow-xl overflow-hidden text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-2xl mb-6">
                <Phone className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-ocean-dark mb-4 font-playfair">
                Emergency Contact
              </h3>
              <p className="text-ocean/70 mb-6 max-w-2xl mx-auto">
                For urgent matters or emergencies while on the island, contact our 24/7 emergency line
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg"
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Emergency: +62 811-HELP-NOW
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactPage; 