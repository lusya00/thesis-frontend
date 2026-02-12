import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Save, X, User, Mail, Phone, MapPin, FileText, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/services/apiConfig';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  last_name: string;
  phone_number: string;
  passport?: string;
  country?: string;
  address?: string;
  type: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface ProfileInformationProps {
  user?: UserProfile | null;
  onProfileUpdate?: (updatedUser: UserProfile) => void;
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({ user: propUser, onProfileUpdate }) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(propUser || null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    phone_number: '',
    passport: '',
    country: '',
    address: ''
  });

  // Update profile when prop changes
  useEffect(() => {
    if (propUser) {
      setProfile(propUser);
    }
  }, [propUser]);

  // Fetch user profile on component mount if no prop provided
  useEffect(() => {
    if (!propUser) {
      fetchUserProfile();
    }
  }, [propUser]);

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      const newFormData = {
        name: profile.name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        passport: profile.passport || '',
        country: profile.country || '',
        address: profile.address || ''
      };
      setFormData(newFormData);
    }
  }, [profile]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/profile/profile');
      const userData = response.data.user || response.data;
      setProfile(userData);
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast({
          title: "Validation Error",
          description: "First name is required",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      if (!formData.last_name.trim()) {
        toast({
          title: "Validation Error", 
          description: "Last name is required",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      if (!formData.phone_number.trim()) {
        toast({
          title: "Validation Error",
          description: "Phone number is required", 
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      // Clean up the data - remove empty optional fields to avoid backend validation issues
      const cleanedData = {
        name: formData.name.trim(),
        last_name: formData.last_name.trim(),
        phone_number: formData.phone_number.trim(),
        ...(formData.passport.trim() && { passport: formData.passport.trim() }),
        ...(formData.country.trim() && { country: formData.country.trim() }),
        ...(formData.address.trim() && { address: formData.address.trim() })
      };
      
      const response = await api.put('/profile/profile', cleanedData);
      
      // Handle different possible response structures
      let updatedUser;
      if (response.data) {
        // Check if response has nested data structure
        if (response.data.data) {
          updatedUser = response.data.data.user || response.data.data;
        } else if (response.data.user) {
          updatedUser = response.data.user;
        } else {
          updatedUser = response.data;
        }
      }
      
      if (updatedUser) {
        setProfile(updatedUser);
        setIsEditing(false);
        
        // Notify parent component of profile update
        if (onProfileUpdate) {
          onProfileUpdate(updatedUser);
        }
        
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        // Still consider it a success and close edit mode
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      // Extract error message from response
      let errorMessage = "Failed to update profile";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (profile) {
      const resetFormData = {
        name: profile.name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        passport: profile.passport || '',
        country: profile.country || '',
        address: profile.address || ''
      };
      setFormData(resetFormData);
    }
  };

  const handleEditClick = () => {
    // Ensure form data is up to date when entering edit mode
    if (profile) {
      const currentFormData = {
        name: profile.name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        passport: profile.passport || '',
        country: profile.country || '',
        address: profile.address || ''
      };
      setFormData(currentFormData);
    }
    setIsEditing(true);
  };

  if (isLoading && !propUser) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-ocean" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-ocean" />
            <span>Loading profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-ocean" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500">Profile not found. Please try refreshing the page.</p>
            <Button onClick={fetchUserProfile} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full shadow-lg">
        <CardHeader className="bg-gradient-to-r from-ocean/5 to-tropical/5">
          <CardTitle className="flex items-center gap-2 text-ocean-dark">
            <Edit className="h-5 w-5 text-ocean" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal details and preferences. These details help us personalize your island experience.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">First Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-sm font-medium">Last Name *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-sm font-medium">Phone Number *</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  placeholder="+1234567890"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passport" className="text-sm font-medium">Passport Number</Label>
                  <Input
                    id="passport"
                    name="passport"
                    type="text"
                    value={formData.passport}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Optional"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 bg-ocean hover:bg-ocean-dark"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Edit Button - More Prominent */}
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Profile Details</h3>
                  <p className="text-sm text-gray-500">Click edit to modify your information</p>
                </div>
                <Button 
                  onClick={handleEditClick}
                  className="bg-ocean hover:bg-ocean-dark text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile Information
                </Button>
              </div>

              {/* Profile Information Display - More Visually Distinct */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <Mail className="h-5 w-5 text-blue-500 mr-3" />
                  <div className="flex-1">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</Label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <User className="h-5 w-5 text-green-500 mr-3" />
                  <div className="flex-1">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</Label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {profile.name && profile.last_name 
                        ? `${profile.name} ${profile.last_name}` 
                        : profile.name || 'Not provided'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <Phone className="h-5 w-5 text-orange-500 mr-3" />
                  <div className="flex-1">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</Label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {profile.phone_number || (
                        <span className="text-gray-400 italic">Click edit to add phone number</span>
                      )}
                    </p>
                  </div>
                </div>
                
                {(profile.passport || isEditing) && (
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    <FileText className="h-5 w-5 text-purple-500 mr-3" />
                    <div className="flex-1">
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Passport Number</Label>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {profile.passport || (
                          <span className="text-gray-400 italic">Click edit to add passport</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
                
                {(profile.country || isEditing) && (
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    <Globe className="h-5 w-5 text-indigo-500 mr-3" />
                    <div className="flex-1">
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Country</Label>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {profile.country || (
                          <span className="text-gray-400 italic">Click edit to add country</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {(profile.address || isEditing) && (
                <div className="flex items-start p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <MapPin className="h-5 w-5 text-red-500 mr-3 mt-1" />
                  <div className="flex-1">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</Label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {profile.address || (
                        <span className="text-gray-400 italic">Click edit to add address</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Help Text */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Complete your profile
                    </h3>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>Add missing information to help us provide you with a better experience. Click "Edit Profile Information" above to update your details.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileInformation;