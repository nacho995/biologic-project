import React from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { useColorStore } from '../../store/colorStore.js';

export const ChannelSelector = ({ colorId, currentChannel }) => {
  const { assignColorToChannel } = useColorStore();

  const handleChannelChange = (event) => {
    const newChannel = parseInt(event.target.value, 10);
    console.log(`ChannelSelector: Changing color ${colorId} to channel ${newChannel}`);
    assignColorToChannel(colorId, newChannel);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
      <Typography variant="caption" sx={{ minWidth: 60, color: 'text.secondary' }}>
        Channel:
      </Typography>
      <FormControl size="small" sx={{ minWidth: 80 }}>
        <Select
          value={currentChannel}
          onChange={handleChannelChange}
          displayEmpty
          sx={{ fontSize: '0.875rem' }}
        >
          <MenuItem value={0}>Ch 0</MenuItem>
          <MenuItem value={1}>Ch 1</MenuItem>
          <MenuItem value={2}>Ch 2</MenuItem>
          <MenuItem value={3}>Ch 3</MenuItem>
          <MenuItem value={4}>Ch 4</MenuItem>
          <MenuItem value={5}>Ch 5</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

