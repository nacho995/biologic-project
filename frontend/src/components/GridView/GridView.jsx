import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { useImageStore } from '../../store/imageStore.js';
import { useImageLoader } from '../../hooks/useImageLoader.js';

const GridCell = ({ imageId, metadata, onClick }) => {
  const { thumbnailUrl } = useImageLoader(imageId);

  return (
    <Card
      sx={{ cursor: 'pointer', height: '100%' }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.transition = 'transform 0.2s';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <CardMedia
        component="img"
        height="120"
        image={thumbnailUrl || ''}
        alt={metadata.well_id || imageId}
      />
      <CardContent sx={{ p: 1 }}>
        <Typography variant="caption" noWrap>
          {metadata.well_id || imageId}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const GridView = () => {
  const { images, setCurrentImage } = useImageStore();

  // Calculate grid dimensions (similar to 96-well plate: 8 rows x 12 columns)
  const rows = 8;
  const cols = 12;

  if (images.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography>No images available</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Grid container spacing={1}>
        {Array.from({ length: rows * cols }).map((_, index) => {
          const image = images[index];
          if (!image) {
            return (
              <Grid item xs={12 / cols} key={`empty-${index}`}>
                <Paper
                  sx={{
                    height: '150px',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" color="textSecondary">
                    Empty
                  </Typography>
                </Paper>
              </Grid>
            );
          }

          return (
            <Grid item xs={12 / cols} key={image.id}>
              <GridCell
                imageId={image.id}
                metadata={image.metadata}
                onClick={() => setCurrentImage(image.id)}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

