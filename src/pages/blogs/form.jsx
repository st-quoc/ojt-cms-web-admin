import { useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  FormControl,
  Paper,
  Stack,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Editor } from '../../components/Editor';
import { rules } from './validator.js';
import CloudinarySingleUploader from '../../components/CloudinarySingleUploader/index.jsx';
import { useNavigate } from 'react-router-dom';

export const BlogForm = ({ isEdit, onSubmit, initialValues }) => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: initialValues });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleCancel = () => {
    navigate('/blogs');
  };

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: 1000, mx: 'auto' }}>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}
      >
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Stack spacing={2}>
            <Typography variant="body1">
              <strong>Information:</strong>
            </Typography>
            <Controller
              name="title"
              control={control}
              rules={rules.title}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Title"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              defaultValue="draft"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="public">Public</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            <FormControl fullWidth>
              <Stack spacing={2}>
                <Typography variant="body1">
                  <strong>Thumbnail:</strong>
                </Typography>
                <Controller
                  name="thumbnail"
                  control={control}
                  rules={rules.thumbnail}
                  defaultValue={[]}
                  render={({ field }) => (
                    <CloudinarySingleUploader
                      image={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.thumbnail && (
                  <Typography color="error" variant="caption">
                    {errors.thumbnail?.message}
                  </Typography>
                )}
              </Stack>
            </FormControl>

            <Typography variant="body1">
              <strong>Short Description:</strong>
            </Typography>
            <Controller
              name="sortDesc"
              control={control}
              rules={rules.sortDesc}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Short Description"
                  multiline
                  error={!!errors.sortDesc}
                  helperText={errors.sortDesc?.message}
                />
              )}
            />
            <Typography variant="body1">
              <strong>Full Description:</strong>
            </Typography>
            <Controller
              name="fullDesc"
              control={control}
              rules={rules.fullDesc}
              render={({ field }) => (
                <Editor
                  initialData={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.fullDesc && (
              <Typography color="error" variant="caption">
                {errors.fullDesc?.message}
              </Typography>
            )}
          </Stack>
        </Paper>

        <Stack spacing={2} direction="row">
          <Box>
            <Button type="submit" variant="contained" color="primary">
              {isEdit ? 'Save' : 'Create'}
            </Button>
          </Box>
          <Box>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};
