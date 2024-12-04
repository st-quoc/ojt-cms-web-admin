import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Paper,
  Typography,
  FormControl,
  Box,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import CloudinarySingleUploader from '../../components/CloudinarySingleUploader';

const TierForm = ({ initialValues, isEdit, onSubmit }) => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialValues,
    mode: 'onBlur',
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleCancel = () => {
    navigate('/tiers');
  };

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: 1000, mx: 'auto' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
          <FormControl fullWidth>
            <Stack spacing={2}>
              <Typography variant="body1">
                <strong>Image:</strong>
              </Typography>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <CloudinarySingleUploader
                    image={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.images && (
                <Typography color="error" variant="caption">
                  {errors.images?.message}
                </Typography>
              )}
            </Stack>
          </FormControl>
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
              name="minSpent"
              control={control}
              rules={{ required: 'Min Spent is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  label="Min Spent"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="maxSpent"
              control={control}
              rules={{ required: 'Max Spent is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  label="Max Spent"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  label="Description"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
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

export default TierForm;
