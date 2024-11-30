import { useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  FormControl,
  Paper,
  Stack,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Editor } from '../../components/Editor';
import CloudinaryMultipleUploader from '../../components/CloudinaryMultipleUploader';
import { rules } from './validator.js';

export const BlogForm = ({ onSubmit, defaultValues }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Box
      sx={{
        maxWidth: 1000,
        m: '0 auto',
      }}
    >
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}
      >
        <Paper elevation={3}>
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
          </Stack>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
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
                  <CloudinaryMultipleUploader
                    images={field.value || []}
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
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
          <Stack spacing={2}>
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
              Create
            </Button>
          </Box>
          <Box>
            <Button variant="outlined">Cancel</Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};
