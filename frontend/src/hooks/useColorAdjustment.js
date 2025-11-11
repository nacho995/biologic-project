import { useCallback, useEffect, useState, useRef } from 'react';
import { useColorStore } from '../store/colorStore.js';
import { useImageStore } from '../store/imageStore.js';
import { adjustImageColor } from '../services/api.js';

export const useColorAdjustment = () => {
  const { adjustments } = useColorStore();
  const { currentImageId } = useImageStore();
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const abortControllerRef = useRef(null);

  const applyAdjustments = useCallback(async () => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    if (!currentImageId) {
      console.log('useColorAdjustment - No current image');
      setProcessedImageUrl(null);
      return;
    }

    const activeAdjustments = adjustments.filter((adj) => adj.enabled);
    if (activeAdjustments.length === 0) {
      console.log('useColorAdjustment - No active adjustments, clearing processed image');
      setProcessedImageUrl(null);
      return;
    }

    console.log('useColorAdjustment - Applying adjustments:', activeAdjustments.length);
    console.log('useColorAdjustment - Adjustments details:', JSON.stringify(activeAdjustments.map(a => ({
      colorId: a.colorId,
      channel: a.channel,
      enabled: a.enabled,
      contrast: a.contrast
    })), null, 2));
    setProcessing(true);
    try {
      const blob = await adjustImageColor(currentImageId, activeAdjustments);
      // Clean up old URL before creating new one
      if (processedImageUrl) {
        URL.revokeObjectURL(processedImageUrl);
      }
      const url = URL.createObjectURL(blob);
      console.log('useColorAdjustment - Adjustments applied successfully:', url);
      setProcessedImageUrl(url);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to apply color adjustments:', error);
        setProcessedImageUrl(null);
      }
    } finally {
      setProcessing(false);
    }
  }, [currentImageId, adjustments, processedImageUrl]);

  // Debounce adjustments to prevent rapid-fire requests
  useEffect(() => {
    const activeAdjustments = adjustments.filter((adj) => adj.enabled);
    const activeCount = activeAdjustments.length;
    
    console.log('useColorAdjustment - Adjustments check:', {
      total: adjustments.length,
      active: activeCount,
      enabled: activeAdjustments.map(a => a.colorId),
      currentImageId
    });
    
    // Debounce with timeout to prevent multiple rapid calls
    const timeoutId = setTimeout(() => {
      if (activeCount > 0 && currentImageId) {
        console.log('useColorAdjustment - Triggering adjustment application');
        applyAdjustments();
      } else {
        console.log('useColorAdjustment - Clearing adjustments (no active colors or no image)');
        if (processedImageUrl) {
          URL.revokeObjectURL(processedImageUrl);
        }
        setProcessedImageUrl(null);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentImageId, JSON.stringify(adjustments)]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (processedImageUrl) {
        URL.revokeObjectURL(processedImageUrl);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    processedImageUrl,
    processing,
    applyAdjustments,
  };
};

