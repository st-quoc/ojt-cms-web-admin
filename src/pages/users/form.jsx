import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Paper,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const UserForm = ({ initialValues, isEdit, onSubmit }) => {
  const navigate = useNavigate();
  const { handleSubmit, control, reset } = useForm({
    defaultValues: initialValues,
    mode: 'onBlur',
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: 1000, mx: 'auto' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
          <Stack spacing={2}>
            <Typography variant="body1">
              <strong>Information:</strong>
            </Typography>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  label="Name"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              rules={{ required: 'Phone number is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  label="Phone number"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Invalid email format',
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  label="Email"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              defaultValue="active"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Stack>
        </Paper>
        <Stack spacing={2} direction="row">
          <Button variant="contained" color="primary" type="submit">
            {isEdit ? 'Update' : 'Create'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ ml: 2 }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default UserForm;
