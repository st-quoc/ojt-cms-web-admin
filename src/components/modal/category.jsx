import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { API_ROOT } from '../../constants';
import CloudinarySingleUploader from '../CloudinarySingleUploader';
import axiosClient from '../../config/axios';
import { useEffect } from 'react';

const ModalCreateCategory = ({ open, onClose, onCreate, initialValues }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      thumbnail: '',
      description: '',
    },
  });

  useEffect(() => {
    if (open && initialValues) {
      reset(initialValues);
    }
  }, [open, initialValues, reset]);

  const onSubmit = async data => {
    try {
      let response;
      if (initialValues) {
        response = await axiosClient.put(
          `${API_ROOT}/admin/category/update/${initialValues._id}`,
          {
            name: data.name.trim(),
            description: data.description.trim(),
            thumbnail: data.thumbnail.trim(),
          },
        );
        toast.success('Category updated successfully!');
      } else {
        response = await axiosClient.post(`${API_ROOT}/admin/category/create`, {
          name: data.name.trim(),
          description: data.description.trim(),
          thumbnail: data.thumbnail.trim(),
        });
        toast.success('Category created successfully!');
      }

      const updatedCategory = response.data;
      onCreate(updatedCategory);
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category!');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          padding: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          {initialValues ? 'Edit Category' : 'Create New Category'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Category Name"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{ mb: 2 }}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={3}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{ mb: 3 }}
              />
            )}
          />

          <Box sx={{ mb: 2 }}>
            <Controller
              name="thumbnail"
              control={control}
              rules={{ required: 'Thumbnail URL is required' }}
              render={({ field }) => (
                <CloudinarySingleUploader
                  image={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.thumbnail && (
              <Typography color="error" variant="caption">
                {errors.thumbnail?.message}
              </Typography>
            )}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Stack direction={'row'} spacing={2}>
            <Button variant="contained" color="primary" type="submit">
              {initialValues ? 'Update' : 'Create'}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onClose()}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalCreateCategory;
