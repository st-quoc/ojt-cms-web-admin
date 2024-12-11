import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useFetchPermissions from '../../hooks/apis/useFetchPermissions';
import axiosClient from '../../config/axios';
import { API_ROOT } from '../../constants';
import { toast } from 'react-toastify';

const ManagerForm = ({ initialValues, isEdit, onSubmit }) => {
  const navigate = useNavigate();
  const { handleSubmit, control, reset, watch } = useForm({
    defaultValues: initialValues,
    mode: 'onBlur',
  });

  const [search, setSearch] = useState('');
  const { permissions, loading, error } = useFetchPermissions(search);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const selectedPermissions = watch('permissions', []);

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleCancel = () => {
    navigate('/managers');
  };

  const handleSearchChange = e => {
    setSearch(e.target.value);
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
        userId: initialValues._id,
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
        <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
          <Stack spacing={2}>
            <Typography variant="body1">
              <strong>Permissions:</strong>
            </Typography>
            <TextField
              fullWidth
              label="Search permissions"
              size="small"
              onChange={handleSearchChange}
              margin="normal"
            />
            <Controller
              name="permissions"
              control={control}
              rules={{
                validate: value =>
                  value?.length > 0 || 'At least one permission is required',
              }}
              render={({ field, fieldState }) => (
                <>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <Alert severity="error">{error}</Alert>
                  ) : (
                    <FormGroup>
                      <Grid container spacing={2} sx={{ py: 2, px: 4 }}>
                        {permissions.map(permission => (
                          <Grid item xs={4} sm={4} md={4} key={permission._id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedPermissions.includes(
                                    permission._id,
                                  )}
                                  onChange={e => {
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                      field.onChange([
                                        ...field.value,
                                        permission._id,
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          v => v !== permission._id,
                                        ),
                                      );
                                    }
                                  }}
                                />
                              }
                              label={permission.description}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormGroup>
                  )}
                  {fieldState.error && (
                    <Typography color="error" variant="caption">
                      {fieldState.error.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Stack>
        </Paper>
        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
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

export default ManagerForm;
