import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  Stack,
  Select,
  TextField,
  Grid,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from 'react';

export const OrdersFilter = ({ filters, setFilters }) => {
  const [tempFilters, setTempFilters] = useState(filters);

  const handleSearchChange = (event) => {
    setTempFilters({
      ...tempFilters,
      search: event.target.value,
    });
  };

  const handleStatusChange = (event) => {
    setTempFilters({
      ...tempFilters,
      status: event.target.value,
    });
  };

  const handleStartDateChange = (event) => {
    setTempFilters({
      ...tempFilters,
      startDate: event.target.value,
    });
  };

  const handleEndDateChange = (event) => {
    setTempFilters({
      ...tempFilters,
      endDate: event.target.value,
    });
  };

  const applyFilters = () => {
    setFilters(tempFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      search: '',
      status: null,
      startDate: null,
      endDate: null,
    };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  const clearSearch = () => {
    setTempFilters({
      ...tempFilters,
      search: '',
    });
    setFilters({
      ...filters,
      search: '',
    });
  };

  return (
    <Box sx={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <Grid container spacing={2}>
        {/* Search */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel size="small">Search order...</InputLabel>
            <OutlinedInput
              size="small"
              type="text"
              label="Search order..."
              value={tempFilters.search}
              onChange={handleSearchChange}
              endAdornment={
                tempFilters.search && (
                  <InputAdornment position="end" onClick={clearSearch}>
                    <ClearIcon style={{ cursor: 'pointer' }} />
                  </InputAdornment>
                )
              }
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Start Date"
            type="date"
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            value={tempFilters.startDate || ''}
            onChange={handleStartDateChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="End Date"
            type="date"
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            value={tempFilters.endDate || ''}
            onChange={handleEndDateChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel size="small">Status</InputLabel>
            <Select
              size="small"
              value={tempFilters.status || ''}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="primary" onClick={resetFilters}>
              Reset
            </Button>
            <Button variant="contained" color="primary" onClick={applyFilters}>
              Apply
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
