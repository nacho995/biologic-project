import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slider,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  FastForward,
  FastRewind
} from '@mui/icons-material';
import { useImageStore } from '../../store/imageStore.js';

export const TemporalTrackingViewer = () => {
  const { currentImageId } = useImageStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames] = useState(10); // En producción, esto vendría de los datos
  const [tracks, setTracks] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => {
          if (prev >= totalFrames - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 500); // 500ms por frame
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, totalFrames]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFrameChange = (newFrame) => {
    setCurrentFrame(newFrame);
    setIsPlaying(false);
  };

  // Mock tracks data
  useEffect(() => {
    if (currentImageId) {
      // En producción, esto cargaría tracks reales del backend
      setTracks([
        { id: 1, frames: [0, 1, 2, 3, 4], color: '#FF0000', velocity: 2.5 },
        { id: 2, frames: [0, 1, 2, 3], color: '#00FF00', velocity: 1.8 },
        { id: 3, frames: [1, 2, 3, 4, 5], color: '#0000FF', velocity: 3.2 },
      ]);
    }
  }, [currentImageId]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Temporal Tracking Viewer
        </Typography>

        {/* Timeline Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={() => handleFrameChange(Math.max(0, currentFrame - 1))}>
            <SkipPrevious />
          </IconButton>
          <IconButton onClick={() => handleFrameChange(Math.max(0, currentFrame - 5))}>
            <FastRewind />
          </IconButton>
          <IconButton
            onClick={handlePlayPause}
            color="primary"
            size="large"
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton onClick={() => handleFrameChange(Math.min(totalFrames - 1, currentFrame + 5))}>
            <FastForward />
          </IconButton>
          <IconButton onClick={() => handleFrameChange(Math.min(totalFrames - 1, currentFrame + 1))}>
            <SkipNext />
          </IconButton>

          <Box sx={{ flex: 1, mx: 2 }}>
            <Slider
              value={currentFrame}
              min={0}
              max={totalFrames - 1}
              step={1}
              onChange={(_, value) => handleFrameChange(value)}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `Frame ${value + 1}`}
            />
          </Box>

          <Typography variant="body2" color="textSecondary">
            Frame {currentFrame + 1} / {totalFrames}
          </Typography>
        </Box>

        {/* Frame Display Placeholder */}
        <Paper
          sx={{
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5F5F5',
            mb: 2
          }}
        >
          <Typography color="textSecondary">
            Frame {currentFrame + 1} - Track overlay would appear here
          </Typography>
        </Paper>
      </Paper>

      {/* Tracks List */}
      {tracks.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Tracks ({tracks.length})
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Track ID</TableCell>
                  <TableCell>Frames</TableCell>
                  <TableCell align="right">Velocity</TableCell>
                  <TableCell>Color</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tracks.map((track) => (
                  <TableRow key={track.id} hover>
                    <TableCell>
                      <Chip label={`Track ${track.id}`} size="small" />
                    </TableCell>
                    <TableCell>
                      {track.frames.length} frames
                    </TableCell>
                    <TableCell align="right">
                      {track.velocity.toFixed(2)} px/frame
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          width: 30,
                          height: 20,
                          backgroundColor: track.color,
                          borderRadius: 1
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

