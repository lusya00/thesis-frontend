import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldX, Loader2, AlertTriangle, CheckCircle, Link as LinkIcon, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { authService } from '@/lib/services/authService';
import { googleOAuthService } from '@/lib/services/googleOAuthService';

interface OAuthSettingsProps {
  className?: string;
}

interface OAuthStatus {
  has_google_linked: boolean;
  can_unlink_google: boolean;
  oauth_picture?: string;
  auth_methods: string[];
}

const OAuthSettings: React.FC<OAuthSettingsProps> = ({ className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [unlinkLoading, setUnlinkLoading] = useState(false);
  const [oauthStatus, setOauthStatus] = useState<OAuthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOAuthStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.getOAuthStatus();
      
      if (response.status === 'success' && response.data) {
        setOauthStatus(response.data);
      } else {
        setError(response.message || 'Failed to fetch OAuth status');
      }
    } catch (error) {
      console.error('Error fetching OAuth status:', error);
      setError('Failed to load OAuth settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOAuthStatus();
  }, []);

  const handleLinkGoogle = () => {
    // Use redirect method for account linking
    googleOAuthService.initiateGoogleAuth('landing');
  };

  const handleUnlinkGoogle = async () => {
    if (!oauthStatus?.can_unlink_google) {
      toast({
        title: "Cannot Unlink Google",
        description: "You cannot unlink your Google account as it's your only authentication method. Please set up a password first.",
        variant: "destructive"
      });
      return;
    }

    setUnlinkLoading(true);
    
    try {
      const response = await authService.unlinkGoogleAccount();
      
      if (response.status === 'success') {
        toast({
          title: "Google Account Unlinked",
          description: "Your Google account has been successfully unlinked.",
        });
        
        // Refresh OAuth status
        fetchOAuthStatus();
      } else {
        throw new Error(response.message || 'Failed to unlink Google account');
      }
    } catch (error) {
      console.error('Error unlinking Google account:', error);
      toast({
        title: "Failed to Unlink",
        description: error instanceof Error ? error.message : "Failed to unlink Google account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUnlinkLoading(false);
    }
  };

  const getSecurityLevel = (): { level: string; icon: React.ReactNode; color: string; description: string } => {
    if (!oauthStatus) {
      return {
        level: 'Unknown',
        icon: <Shield className="h-5 w-5" />,
        color: 'text-gray-500',
        description: 'Loading security status...'
      };
    }

    const authMethodsCount = oauthStatus.auth_methods.length;
    const hasGoogle = oauthStatus.has_google_linked;
    const hasPassword = oauthStatus.auth_methods.includes('email');

    if (authMethodsCount === 1) {
      if (hasGoogle) {
        return {
          level: 'Good',
          icon: <ShieldCheck className="h-5 w-5" />,
          color: 'text-yellow-600',
          description: 'Protected by Google authentication'
        };
      } else {
        return {
          level: 'Basic',
          icon: <Shield className="h-5 w-5" />,
          color: 'text-blue-600',
          description: 'Protected by password only'
        };
      }
    } else if (authMethodsCount >= 2) {
      return {
        level: 'Excellent',
        icon: <ShieldCheck className="h-5 w-5" />,
        color: 'text-green-600',
        description: 'Protected by multiple authentication methods'
      };
    } else {
      return {
        level: 'Low',
        icon: <ShieldX className="h-5 w-5" />,
        color: 'text-red-600',
        description: 'No authentication methods configured'
      };
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-ocean" />
            <span className="ml-2 text-gray-600">Loading authentication settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
          <div className="text-center mt-4">
            <Button onClick={fetchOAuthStatus} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const securityInfo = getSecurityLevel();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Authentication & Security
        </CardTitle>
        <CardDescription>
          Manage your account security and sign-in methods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Level */}
        <motion.div 
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className={`${securityInfo.color}`}>
              {securityInfo.icon}
            </div>
            <div>
              <div className="font-medium">Security Level: {securityInfo.level}</div>
              <div className="text-sm text-gray-600">{securityInfo.description}</div>
            </div>
          </div>
          <Badge 
            variant={securityInfo.level === 'Excellent' ? 'default' : 
                   securityInfo.level === 'Good' ? 'secondary' : 'destructive'}
          >
            {securityInfo.level}
          </Badge>
        </motion.div>

        {/* Authentication Methods */}
        <div>
          <h4 className="font-medium mb-3">Authentication Methods</h4>
          <div className="space-y-3">
            {/* Email/Password */}
            <motion.div 
              className="flex items-center justify-between p-3 border rounded-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Email & Password</div>
                  <div className="text-sm text-gray-600">Traditional sign-in method</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {oauthStatus?.auth_methods.includes('email') ? (
                  <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    Not Set
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Google OAuth */}
            <motion.div 
              className="flex items-center justify-between p-3 border rounded-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Google Account</div>
                  <div className="text-sm text-gray-600">Sign in with your Google account</div>
                  {oauthStatus?.oauth_picture && (
                    <div className="flex items-center gap-2 mt-1">
                      <img 
                        src={oauthStatus.oauth_picture} 
                        alt="Google Profile" 
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-gray-500">Profile linked</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {oauthStatus?.has_google_linked ? (
                  <>
                    <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Linked
                    </Badge>
                    <Button
                      onClick={handleUnlinkGoogle}
                      disabled={unlinkLoading || !oauthStatus.can_unlink_google}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {unlinkLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Unlink className="h-3 w-3 mr-1" />
                      )}
                      Unlink
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleLinkGoogle}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <LinkIcon className="h-3 w-3 mr-1" />
                    Link Account
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Security Recommendations */}
        {oauthStatus && oauthStatus.auth_methods.length < 2 && (
          <motion.div 
            className="p-4 bg-amber-50 border border-amber-200 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <div className="font-medium text-amber-800">Security Recommendation</div>
                <div className="text-sm text-amber-700 mt-1">
                  For better security, we recommend setting up multiple authentication methods. 
                  {!oauthStatus.has_google_linked && " Consider linking your Google account for easier and more secure sign-ins."}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default OAuthSettings; 