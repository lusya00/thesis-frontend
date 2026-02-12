import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bell, Mail, MessageSquare, Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/services/apiConfig';

interface NotificationPreferences {
  email_bookings: boolean;
  email_promotions: boolean;
  email_reminders: boolean;
  sms_bookings: boolean;
  sms_reminders: boolean;
}

const NotificationPreferences: React.FC = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_bookings: true,
    email_promotions: false,
    email_reminders: true,
    sms_bookings: false,
    sms_reminders: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [hasLoadedSuccessfully, setHasLoadedSuccessfully] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/profile/notification-preferences');
      const preferencesData = response.data.preferences || response.data;
      setPreferences(preferencesData);
      setApiAvailable(true);
      setHasLoadedSuccessfully(true);
    } catch (error: any) {
      console.error('Preferences fetch error:', error);
      
      // Check if it's a 404 error (API endpoint not implemented)
      if (error.response?.status === 404) {
        setApiAvailable(false);
        
        // Use default preferences when API is not available
        setPreferences({
          email_bookings: true,
          email_promotions: false,
          email_reminders: true,
          sms_bookings: false,
          sms_reminders: false
        });
        
        toast({
          title: "Notice",
          description: "Notification preferences are not available yet. Using default settings for now.",
          variant: "default",
        });
      } else {
        // Other errors
        setApiAvailable(true);
        toast({
          title: "Notice",
          description: "Could not load notification preferences. Using default settings.",
          variant: "default",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    if (!apiAvailable) {
      toast({
        title: "Feature Not Available",
        description: "Notification preferences API is not implemented yet. Your settings cannot be saved at this time.",
        variant: "default",
      });
      return;
    }

    setIsSaving(true);
    try {
      await api.put('/profile/notification-preferences', preferences);
      toast({
        title: "Success",
        description: "Notification preferences updated successfully",
      });
    } catch (error: any) {
      console.error('Preferences update error:', error);
      
      if (error.response?.status === 404) {
        setApiAvailable(false);
        toast({
          title: "Feature Not Available",
          description: "Notification preferences API is not implemented yet. Your settings cannot be saved at this time.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to update preferences",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span>Loading preferences...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="w-full shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500/5 to-purple-500/5">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Bell className="h-5 w-5 text-blue-600" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Control how and when you receive notifications about your bookings and our latest offers.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* API Not Available Warning */}
          {!apiAvailable && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">Feature Coming Soon</h4>
                  <p className="text-sm text-amber-700">
                    Notification preferences are not fully implemented yet. You can preview the settings below, but changes cannot be saved at this time. 
                    This feature will be available once the backend API is configured.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Email Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <Mail className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Email Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">Booking Updates</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Get notified about booking confirmations, changes, and cancellations
                  </p>
                </div>
                <Switch
                  checked={preferences.email_bookings}
                  onCheckedChange={() => handleToggle('email_bookings')}
                  className="ml-4"
                  disabled={!apiAvailable}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">Promotions & Offers</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Receive special deals, discounts, and promotional offers
                  </p>
                </div>
                <Switch
                  checked={preferences.email_promotions}
                  onCheckedChange={() => handleToggle('email_promotions')}
                  className="ml-4"
                  disabled={!apiAvailable}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">Booking Reminders</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Get reminded about upcoming check-ins and important dates
                  </p>
                </div>
                <Switch
                  checked={preferences.email_reminders}
                  onCheckedChange={() => handleToggle('email_reminders')}
                  className="ml-4"
                  disabled={!apiAvailable}
                />
              </div>
            </div>
          </div>

          {/* SMS Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">SMS Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">Booking Updates</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Get SMS alerts for urgent booking updates
                  </p>
                </div>
                <Switch
                  checked={preferences.sms_bookings}
                  onCheckedChange={() => handleToggle('sms_bookings')}
                  className="ml-4"
                  disabled={!apiAvailable}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">Booking Reminders</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Get SMS reminders for check-in and important dates
                  </p>
                </div>
                <Switch
                  checked={preferences.sms_reminders}
                  onCheckedChange={() => handleToggle('sms_reminders')}
                  className="ml-4"
                  disabled={!apiAvailable}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button 
              onClick={handleSave}
              disabled={isSaving || !apiAvailable}
              className={`w-full ${apiAvailable ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {apiAvailable ? 'Manage Notifications' : 'Feature Not Available'}
                </>
              )}
            </Button>
          </div>

          {/* Information Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">📱 Stay Connected</h4>
            <p className="text-sm text-blue-700">
              {apiAvailable 
                ? "We respect your privacy and will only send you notifications you've opted into. You can change these settings at any time to customize your experience."
                : "Once the notification system is fully implemented, you'll be able to customize how and when you receive updates about your bookings and special offers."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationPreferences;