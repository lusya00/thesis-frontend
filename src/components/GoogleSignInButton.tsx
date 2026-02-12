import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { googleOAuthService } from '@/lib/services/googleOAuthService';

interface GoogleSignInButtonProps {
  userType?: 'landing' | 'admin';
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  onSuccess?: (token: string, isNew: boolean) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  usePopup?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  userType = 'landing',
  variant = 'outline',
  size = 'default',
  className = '',
  onSuccess,
  onError,
  disabled = false,
  usePopup = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const GoogleIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  const handleGoogleSignIn = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);

    try {
      if (usePopup) {
        // Use popup method
        const result = await googleOAuthService.openGoogleAuthPopup(userType);
        
        if (result.error) {
          let errorMessage = 'Authentication failed';
          switch (result.error) {
            case 'oauth_cancelled':
              errorMessage = 'Google authentication was cancelled';
              break;
            case 'oauth_error':
              errorMessage = 'Authentication failed. Please try again.';
              break;
            default:
              errorMessage = 'An error occurred during authentication';
          }
          
          if (onError) {
            onError(errorMessage);
          } else {
            toast({
              title: "Authentication Failed",
              description: errorMessage,
              variant: "destructive"
            });
          }
          return;
        }

        if (result.token) {
          if (onSuccess) {
            onSuccess(result.token, result.isNew || false);
          } else {
            // Default success handling
            toast({
              title: "Success!",
              description: result.isNew ? "Welcome! Your account has been created." : "Welcome back!",
            });
          }
        }
      } else {
        // Use redirect method
        googleOAuthService.initiateGoogleAuth(userType);
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      if (onError) {
        onError(errorMessage);
      } else {
        toast({
          title: "Authentication Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Connecting...';
    return userType === 'admin' ? 'Continue with Google (Admin)' : 'Continue with Google';
  };

  const getButtonClasses = () => {
    const baseClasses = `
      relative overflow-hidden group transition-all duration-300 
      ${size === 'sm' ? 'h-9 px-3 text-sm' : size === 'lg' ? 'h-12 px-6 text-base' : 'h-10 px-4'}
      ${className}
    `;

    switch (variant) {
      case 'default':
        return `${baseClasses} bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md`;
      case 'secondary':
        return `${baseClasses} bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200`;
      default: // outline
        return `${baseClasses} bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-ocean/30 hover:shadow-lg`;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={disabled || isLoading}
        className={getButtonClasses()}
      >
        {/* Background shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
          animate={{ x: [-100, 200] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
        />
        
        {/* Button content */}
        <div className="relative flex items-center justify-center gap-3 w-full">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <GoogleIcon />
            </motion.div>
          )}
          <span className="font-medium">
            {getButtonText()}
          </span>
        </div>
      </Button>
    </motion.div>
  );
};

export default GoogleSignInButton; 