import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosClient from '../../config/axios';
import { API_ROOT } from '../../constants';
import { useEffect } from 'react';

const ModalCreateColor = ({ open, onClose, onCreate, initialValues }) => {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      colorName: '',
    },
  });

  useEffect(() => {
    if (open && initialValues) {
      reset({ colorName: initialValues.name });
    }
  }, [open, initialValues, reset]);

  const handleCreateOrEdit = async data => {
    try {
      let response;
      if (initialValues) {
        response = await axiosClient.put(
          `${API_ROOT}/admin/color/update/${initialValues._id}`,
          {
            name: data.colorName.trim(),
          },
        );
        toast.success('Color updated successfully!');
      } else {
        response = await axiosClient.post(`${API_ROOT}/admin/color/create`, {
          name: data.colorName.trim(),
        });
        toast.success('Color created successfully!');
      }

      const newColor = response.data;
      onCreate(newColor);
      reset();
      onClose();
    } catch {
      toast.error('Failed to save color!');
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
          {initialValues ? 'Edit Color' : 'Create New Color'}
        </Typography>

        <form onSubmit={handleSubmit(handleCreateOrEdit)}>
          <Controller
            name="colorName"
            control={control}
            rules={{ required: 'Color name is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Color Name"
                fullWidth
                sx={{ mb: 2 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            {initialValues ? 'Update Color' : 'Create Color'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalCreateColor;
