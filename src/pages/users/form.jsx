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
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../../config/axios';
import { toast } from 'react-toastify';
import { API_ROOT } from '../../constants';

const UserForm = ({ initialValues, isEdit, onSubmit }) => {
  const navigate = useNavigate();
  const { handleSubmit, control, reset } = useForm({
    defaultValues: initialValues,
    mode: 'onBlur',
  });

  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleCancel = () => {
    navigate('/users');
  };

  const handleOpenResetDialog = () => {
    setOpenResetDialog(true);
  };

  const handleCloseResetDialog = () => {
    setOpenResetDialog(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    try {
      await axiosClient.post(`${API_ROOT}/auth/reset-pass-for-user`, {
        userId: initialValues.id,
        newPassword,
      });
      toast.success('Reset password succsessfully');
    } catch (error) {
      toast.error('Reset password failed!');
    }
    handleCloseResetDialog();
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
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenResetDialog}
              >
                Reset Password
              </Button>
            </Box>
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
      <Dialog open={openResetDialog} onClose={handleCloseResetDialog}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          {passwordError && (
            <Typography color="error" variant="caption">
              {passwordError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleResetPassword} color="primary">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserForm;
