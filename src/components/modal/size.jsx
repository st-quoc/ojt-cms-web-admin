import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosClient from '../../config/axios';
import { API_ROOT } from '../../constants';
import { useEffect } from 'react';

const ModalCreateSize = ({ open, onClose, onCreate, initialValues }) => {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      sizeName: '',
    },
  });

  useEffect(() => {
    if (open && initialValues) {
      reset({ sizeName: initialValues.name });
    }
  }, [open, initialValues, reset]);

  const handleCreateOrEdit = async data => {
    try {
      let response;
      if (initialValues) {
        response = await axiosClient.put(
          `${API_ROOT}/admin/size/update/${initialValues._id}`,
          {
            name: data.sizeName.trim(),
          },
        );
        toast.success('Size updated successfully!');
      } else {
        response = await axiosClient.post(`${API_ROOT}/admin/size/create`, {
          name: data.sizeName.trim(),
        });
        toast.success('Size created successfully!');
      }

      const newSize = response.data;
      onCreate(newSize);
      reset();
      onClose();
    } catch {
      toast.error('Failed to save size!');
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
          width: 300,
          padding: 2,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {initialValues ? 'Edit Size' : 'Create New Size'}
        </Typography>

        <form onSubmit={handleSubmit(handleCreateOrEdit)}>
          <Controller
            name="sizeName"
            control={control}
            rules={{ required: 'Size name is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Size Name"
                fullWidth
                sx={{ mb: 2 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            {initialValues ? 'Update Size' : 'Create Size'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalCreateSize;
