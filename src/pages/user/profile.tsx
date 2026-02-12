import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, UserProfile } from '@/services/userApi';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Form state
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const profileData = await getUserProfile();
        setProfile(profileData);
        
        // Initialize form with profile data
        setName(profileData.name);
        setEmail(profileData.email);
        setPhone(profileData.phone || '');
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        setError(err.response?.data?.message || 'Failed to load account data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile update functionality will be implemented here');
    setIsEditing(false);
  };
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your profile...</Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }
  
  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Profile not found. You may need to log in again.
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/auth/login')}
            >
              Go to Login
            </Button>
          </Box>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        {!isEditing ? (
          // View mode
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mr: 3,
                  bgcolor: 'primary.main' 
                }}
                src={profile.profileImg}
                alt={profile.name}
              >
                {profile.name.charAt(0).toUpperCase()}
              </Avatar>
              
              <Box>
                <Typography variant="h5" gutterBottom>
                  {profile.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Member since {formatDate(profile.joinedDate)}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{profile.email}</Typography>
              </div>
              
              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">{profile.phone || 'Not provided'}</Typography>
              </div>
            </div>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/user/bookings')}
                sx={{ mr: 1 }}
              >
                My Bookings
              </Button>
              <Button 
                variant="contained" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </Box>
          </>
        ) : (
          // Edit mode
          <Box component="form" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '16px' }}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled // Email changes might require verification
              />
              
              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={() => setIsEditing(false)}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
} 