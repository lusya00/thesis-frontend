import React from 'react';
import { motion } from 'framer-motion';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import Footer from '@/components/Footer';
import ProfileInformation from '@/components/profile/ProfileInformation';
import ChangePassword from '@/components/profile/ChangePassword';
import NotificationPreferences from '@/components/profile/NotificationPreferences';

const ProfileManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-light/20 via-sand-light/30 to-tropical-light/20">
      <EnhancedNavbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-ocean-dark mb-2">Account Settings</h1>
          <p className="text-lg text-gray-600">
            Manage your profile, security, and notification preferences
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Profile Information Section */}
          <ProfileInformation />

          {/* Change Password Section */}
          <ChangePassword />

          {/* Notification Preferences Section */}
          <NotificationPreferences />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileManagement; 