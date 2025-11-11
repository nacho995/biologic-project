import { useState, useEffect } from 'react';
import { getImage, getThumbnail } from '../services/api.js';

export const useImageLoader = (imageId) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('useImageLoader - imageId:', imageId);
    
    if (!imageId) {
      setImageUrl(null);
      setThumbnailUrl(null);
      return;
    }

    const loadImage = async () => {
      console.log('useImageLoader - Loading image:', imageId);
      setLoading(true);
      setError(null);
      try {
        const [imageBlob, thumbUrl] = await Promise.all([
          getImage(imageId),
          getThumbnail(imageId),
        ]);
        const url = URL.createObjectURL(imageBlob);
        console.log('useImageLoader - Image loaded successfully:', url);
        setImageUrl(url);
        setThumbnailUrl(thumbUrl);
      } catch (err) {
        console.error('useImageLoader - Error loading image:', err);
        setError(err instanceof Error ? err : new Error('Failed to load image'));
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
    };
  }, [imageId]);

  return { imageUrl, thumbnailUrl, loading, error };
};

