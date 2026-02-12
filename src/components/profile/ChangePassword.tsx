import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Eye, EyeOff, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/services/apiConfig';

const ChangePassword: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.new_password !== formData.confirm_password) {
      toast({
        title: "Error",
        description: "New password and confirmation do not match",
        variant: "destructive",
      });
      return;
    }

    // Validate password strength
    if (formData.new_password.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Only send current_password and new_password to backend
      await api.put('/profile/change-password', {
        current_password: formData.current_password,
        new_password: formData.new_password
      });

      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      
      // Clear form
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error: any) {
      console.error('Password change error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="w-full shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500/5 to-yellow-500/5">
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Lock className="h-5 w-5 text-orange-600" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password regularly to keep your account secure and protected.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current_password" className="text-sm font-medium">Current Password *</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  name="current_password"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.current_password}
                  onChange={handleInputChange}
                  required
                  className="w-full pr-10"
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password" className="text-sm font-medium">New Password *</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  name="new_password"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.new_password}
                  onChange={handleInputChange}
                  required
                  className="w-full pr-10"
                  placeholder="Enter your new password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="text-sm font-medium">Confirm New Password *</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  required
                  className="w-full pr-10"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Password Security Tips:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Use at least 6 characters</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Add numbers and special characters</li>
              <li>• Don't reuse old passwords</li>
              <li>• Change your password regularly</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChangePassword; 