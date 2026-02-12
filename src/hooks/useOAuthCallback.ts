import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/services/authService';
import { debugLog } from '../lib/utils';

interface UseOAuthCallbackResult {
  isProcessing: boolean;
  error: string | null;
}

export const useOAuthCallback = (): UseOAuthCallbackResult => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      debugLog('[OAUTH_CALLBACK] Current URL:', window.location.href);
      debugLog('[OAUTH_CALLBACK] URL search params:', window.location.search);
      debugLog('[OAUTH_CALLBACK] URL pathname:', window.location.pathname);
      
      const urlParams = new URLSearchParams(window.location.search);
      debugLog('[OAUTH_CALLBACK] All URL parameters:', Array.from(urlParams.entries()));
      
      if (urlParams.toString() === '') {
        debugLog('[OAUTH_CALLBACK] No search parameters, skipping OAuth processing');
        return;
      }
      
      const token = urlParams.get('token');
      const userType = urlParams.get('user_type');
      const isNew = urlParams.get('is_new') === 'true';
      const error = urlParams.get('error');
      
      debugLog('[OAUTH_CALLBACK] Extracted parameters:', { 
        token: token ? 'PRESENT' : 'MISSING', 
        userType, 
        isNew, 
        error 
      });
      
      if (error) {
        debugLog('[OAUTH_CALLBACK] OAuth error detected:', error);
        setError(error);
        
        let errorMessage = 'Authentication failed';
        switch (error) {
          case 'oauth_cancelled':
            errorMessage = 'Google authentication was cancelled';
            break;
          case 'oauth_error':
            errorMessage = 'Authentication failed. Please try again.';
            break;
          case 'access_denied':
            errorMessage = 'Access denied. Please grant necessary permissions.';
            break;
          case 'invalid_request':
            errorMessage = 'Invalid authentication request.';
            break;
          default:
            errorMessage = 'An error occurred during authentication';
        }

        toast({
          title: "Authentication Failed",
          description: errorMessage,
          variant: "destructive"
        });
        
        window.history.replaceState({}, document.title, '/login');
        navigate('/login');
        return;
      }
      
      if (token) {
        debugLog('[OAUTH_CALLBACK] Token found, processing authentication...');
        setIsProcessing(true);
        
        try {
          debugLog('[OAUTH_CALLBACK] Storing token in localStorage...');
          localStorage.setItem('jwt_token', token);
          localStorage.setItem('userType', userType || 'landing_user');
          
          debugLog('[OAUTH_CALLBACK] Fetching user profile data...');
          const isTokenValid = await authService.validateToken();
          
          if (!isTokenValid) {
            throw new Error('Token validation failed after OAuth');
          }
          
          const currentUser = authService.getCurrentUser();
          debugLog('[OAUTH_CALLBACK] Retrieved user data:', currentUser);

          debugLog('[OAUTH_CALLBACK] Dispatching auth-changed event');
          window.dispatchEvent(new Event('auth-changed'));

          if (isNew) {
            toast({
              title: "Welcome to Untung Jawa!",
              description: "Your account has been created successfully with Google.",
            });
          } else {
            toast({
              title: "Welcome back!",
              description: "You've been signed in successfully.",
            });
          }

          debugLog('[OAUTH_CALLBACK] Processing redirect for user type:', userType);
          
          if (userType === 'admin' || userType === 'admin_user') {
            debugLog('[OAUTH_CALLBACK] Admin user detected - redirecting to external admin system');
            toast({
              title: "Admin Access",
              description: "Redirecting to admin system...",
            });
            window.location.href = 'https://admin.untungjawa.com';
            return;
          } else {
            debugLog('[OAUTH_CALLBACK] Redirecting to user dashboard');
            
            setTimeout(() => {
              navigate('/user/dashboard', { replace: true });
            }, 100);
          }
          
          debugLog('[OAUTH_CALLBACK] OAuth callback processing complete');
          
        } catch (error) {
          debugLog('[OAUTH_CALLBACK] Error processing OAuth callback:', error);
          setError('Failed to process authentication');
          
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('userType');
          
          toast({
            title: "Authentication Error",
            description: "Failed to complete sign-in. Please try again.",
            variant: "destructive"
          });
          
          debugLog('[OAUTH_CALLBACK] Redirecting to login page due to error');
          navigate('/login');
        } finally {
          setIsProcessing(false);
        }
      } else {
        debugLog('[OAUTH_CALLBACK] No token found in URL parameters');
        const hasOAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('user_type');
        
        if (hasOAuthParams) {
          debugLog('[OAUTH_CALLBACK] OAuth parameters detected but no token. Backend might still be processing.');
          debugLog('[OAUTH_CALLBACK] Available URL parameters:', Array.from(urlParams.entries()));
        }
      }
    };

    const isOAuthCallback = location.pathname.includes('/auth/callback') || 
                           location.pathname.includes('/oauth/callback') || 
                           location.pathname.includes('/api/oauth/google/callback');
    
    if (isOAuthCallback) {
      debugLog('[OAUTH_CALLBACK] OAuth callback path detected, processing...');
      handleOAuthCallback();
    }
  }, [location.search, location.pathname, navigate, toast]);

  return {
    isProcessing,
    error
  };
}; 