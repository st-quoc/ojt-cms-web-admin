import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import useFetchPermissions from '../../hooks/apis/useFetchPermissions';
import { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export const Permissions = () => {
  const [search, setSearch] = useState('');

  const { permissions, loading, error } = useFetchPermissions();
  const userPermissions =
    JSON.parse(localStorage.getItem('userInfo')).permissions || [];

  const checkPermission = permissionName => {
    return userPermissions.includes(permissionName);
  };

  const handleSearchChange = e => {
    setSearch(e.target.value);
  };

  return (
    <Box sx={{ p: 4, mb: 4 }} >
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Search permissions"
          value={search}
          size="small"
          onChange={handleSearchChange}
          margin="normal"
        />

        {loading ? (
          <Stack>
            <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
          </Stack>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={2} sx={{ py: 2, px: 4 }}>
            {permissions
              .filter(permission =>
                permission.description
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              )
              .map(permission => (
                <Grid item xs={6} sm={6} md={6} key={permission._id}>
                  <Stack direction="row" alignItems="center">
                    {checkPermission(permission.name) ? (
                      <IconButton color="success">
                        <CheckCircleIcon />
                      </IconButton>
                    ) : (
                      <IconButton color="error">
                        <CancelIcon />
                      </IconButton>
                    )}
                    <Typography>{permission.description}</Typography>
                  </Stack>
                </Grid>
              ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
};
