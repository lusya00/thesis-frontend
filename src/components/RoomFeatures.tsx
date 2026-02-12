
import { RoomFeature, FeatureCategory } from '@/types/room';
import { Card, CardContent, Typography, Grid, Box, Chip, Tooltip, Avatar } from '@mui/material';

interface RoomFeaturesProps {
  features: RoomFeature[];
  compact?: boolean;
  maxItems?: number;
}

const categoryLabels: Record<string, string> = {
  [FeatureCategory.Bedroom]: 'Bedroom',
  [FeatureCategory.Bathroom]: 'Bathroom',
  [FeatureCategory.Kitchen]: 'Kitchen',
  [FeatureCategory.Entertainment]: 'Entertainment',
  [FeatureCategory.Comfort]: 'Comfort',
  [FeatureCategory.Safety]: 'Safety',
  [FeatureCategory.Accessibility]: 'Accessibility',
  [FeatureCategory.Outdoor]: 'Outdoor',
  [FeatureCategory.Service]: 'Service',
  [FeatureCategory.Storage]: 'Storage',
  [FeatureCategory.View]: 'View',
  [FeatureCategory.Dining]: 'Dining',
  [FeatureCategory.Business]: 'Business',
  [FeatureCategory.Wellness]: 'Wellness',
  [FeatureCategory.Transportation]: 'Transportation',
};

// Define category colors for better visual distinction
const categoryColors: Record<string, string> = {
  [FeatureCategory.Bedroom]: '#4caf50', // green
  [FeatureCategory.Bathroom]: '#03a9f4', // light blue
  [FeatureCategory.Kitchen]: '#ff9800', // orange
  [FeatureCategory.Entertainment]: '#9c27b0', // purple
  [FeatureCategory.Comfort]: '#f44336', // red
  [FeatureCategory.Safety]: '#795548', // brown
  [FeatureCategory.Accessibility]: '#607d8b', // blue grey
  [FeatureCategory.Outdoor]: '#8bc34a', // light green
  [FeatureCategory.Service]: '#ffc107', // amber
  [FeatureCategory.Storage]: '#3f51b5', // indigo
  [FeatureCategory.View]: '#00bcd4', // cyan
  [FeatureCategory.Dining]: '#e91e63', // pink
  [FeatureCategory.Business]: '#2196f3', // blue
  [FeatureCategory.Wellness]: '#ff5722', // deep orange
  [FeatureCategory.Transportation]: '#9e9e9e', // grey
};

export default function RoomFeatures({ features, compact = false, maxItems }: RoomFeaturesProps) {
  // Handle empty features gracefully
  if (!features || features.length === 0) {
    return null;
  }

  // Limit features if maxItems is specified
  const displayFeatures = maxItems ? features.slice(0, maxItems) : features;
  const hasMoreFeatures = maxItems && features.length > maxItems;

  // Group features by category
  const groupedFeatures = displayFeatures.reduce((acc, feature) => {
    const category = feature.category as string;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, RoomFeature[]>);

  if (compact) {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
        {displayFeatures.map((feature) => (
          <Tooltip 
            key={feature.id} 
            title={feature.description || feature.title}
            arrow
          >
            <Chip
              label={feature.title}
              size="small"
              variant="outlined"
              sx={{
                borderColor: categoryColors[feature.category] || 'divider',
                borderWidth: 1,
                '&:hover': {
                  backgroundColor: `${categoryColors[feature.category]}10`,
                },
              }}
              avatar={
                feature.symbol ? (
                  <Avatar 
                    sx={{ 
                      backgroundColor: 'transparent',
                      '& span': { display: 'flex', alignItems: 'center', justifyContent: 'center' }
                    }}
                  >
                    <span dangerouslySetInnerHTML={{ __html: feature.symbol }} />
                  </Avatar>
                ) : undefined
              }
            />
          </Tooltip>
        ))}
        {hasMoreFeatures && (
          <Chip
            label={`+${features.length - maxItems!} more`}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
          <Grid sx={{ width: { xs: '100%', sm: '50%', md: '33.333%' } }} key={category}>
            <Card variant="outlined" sx={{ 
              height: '100%', 
              borderColor: categoryColors[category] || 'divider',
              '&:hover': {
                boxShadow: 2,
                borderColor: categoryColors[category] || 'primary.main',
              },
              transition: 'all 0.2s ease-in-out'
            }}>
              <CardContent sx={{ pb: 1 }}>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  sx={{ 
                    color: categoryColors[category] || 'text.primary',
                    borderBottom: 1,
                    borderColor: 'divider',
                    pb: 0.5
                  }}
                >
                  {categoryLabels[category] || category}
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {categoryFeatures.map((feature) => (
                    <Typography
                      component="li"
                      key={feature.id}
                      variant="body2"
                      sx={{ 
                        mb: 1,
                        display: 'flex',
                        alignItems: 'flex-start'
                      }}
                    >
                      {feature.symbol ? (
                        <Box
                          component="span"
                          sx={{ 
                            mr: 1,
                            color: categoryColors[category] || 'inherit',
                            minWidth: 24,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          dangerouslySetInnerHTML={{ __html: feature.symbol }}
                        />
                      ) : (
                        <Box 
                          component="span" 
                          sx={{ 
                            mr: 1,
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            bgcolor: categoryColors[category] || 'primary.main',
                            display: 'inline-block',
                            mt: 1
                          }} 
                        />
                      )}
                      <Box>
                        {feature.title}
                        {feature.description && (
                          <Typography 
                            variant="caption" 
                            display="block" 
                            sx={{ 
                              ml: 0,
                              color: 'text.secondary',
                              mt: 0.5
                            }}
                          >
                            {feature.description}
                          </Typography>
                        )}
                      </Box>
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {hasMoreFeatures && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Chip
            label={`${features.length - maxItems!} more features available`}
            color="primary"
            variant="outlined"
          />
        </Box>
      )}
    </Box>
  );
}
