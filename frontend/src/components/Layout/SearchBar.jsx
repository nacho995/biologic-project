import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Chip,
  ClickAwayListener,
} from '@mui/material';
import { Search as SearchIcon, Image as ImageIcon } from '@mui/icons-material';
import { useImageStore } from '../../store/imageStore.js';

export const SearchBar = ({ isMobile, theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredImages, setFilteredImages] = useState([]);
  const { images, setCurrentImage } = useImageStore();
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = images.filter((img) =>
        img.originalFilename?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredImages(filtered);
      setShowResults(filtered.length > 0);
    } else {
      setFilteredImages([]);
      setShowResults(false);
    }
  }, [searchQuery, images]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleImageSelect = (imageId) => {
    setCurrentImage(imageId);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleClickAway = () => {
    setShowResults(false);
  };

  const formatFileSize = (dimensions) => {
    if (!dimensions) return '';
    return `${dimensions.width}×${dimensions.height}`;
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        ref={searchRef}
        sx={{
          position: 'relative',
          width: { sm: '200px', md: '280px', lg: '320px' },
          mr: { sm: 2, md: 3 },
        }}
      >
        <TextField
          placeholder="Search images by filename..."
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => searchQuery && setShowResults(true)}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: { sm: 18, md: 20 } }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Dropdown Results */}
        {showResults && filteredImages.length > 0 && (
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              maxHeight: 400,
              overflow: 'auto',
              zIndex: 9999,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <List sx={{ py: 0 }}>
              {filteredImages.slice(0, 8).map((image, index) => (
                <ListItem
                  key={image.id}
                  button
                  onClick={() => handleImageSelect(image.id)}
                  sx={{
                    borderBottom: index < filteredImages.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={image.thumbnail || `/api/images/${image.id}/thumbnail`}
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'primary.main',
                      }}
                    >
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {image.originalFilename || `Image ${image.id.slice(0, 8)}`}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        {image.dimensions && (
                          <Chip
                            label={formatFileSize(image.dimensions)}
                            size="small"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                          />
                        )}
                        {image.dimensions?.depth > 1 && (
                          <Chip
                            label={`${image.dimensions.depth} slices`}
                            size="small"
                            color="primary"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}

              {filteredImages.length > 8 && (
                <ListItem sx={{ justifyContent: 'center', py: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    +{filteredImages.length - 8} more results
                  </Typography>
                </ListItem>
              )}
            </List>
          </Paper>
        )}

        {/* No Results */}
        {showResults && searchQuery && filteredImages.length === 0 && (
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              p: 3,
              zIndex: 9999,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No images found for "{searchQuery}"
            </Typography>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

