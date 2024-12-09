import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useFetchProfile from '../../hooks/apis/useFetchProfile';
import { AvatarUploader } from '../../components/AvatarUploader';
import defaultImage from '../../assets/default.png';
import { useEffect, useState } from 'react';
import useChangeProfile from '../../hooks/apis/useChangeProfile';
import { Navigate } from 'react-router-dom';
import useChangePassword from '../../hooks/apis/useChangePassword';
import { useForm } from 'react-hook-form';

export const ProfileTab = () => {
  const { userInfo, loading, error } = useFetchProfile();
  const { changeProfile } = useChangeProfile();
  const { changePassword } = useChangePassword();

  const [isEdit, setIsEdit] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openForgotPasswordDialog, setOpenForgotPasswordDialog] =
    useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      address: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (userInfo && !loading) {
      reset(userInfo);
    }
  }, [userInfo, loading]);

  const handleChange = (key, value) => {
    userInfo[key] = value;
  };

  const handleSave = async data => {
    await changeProfile(data);
    setIsEdit(false);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setNewPassword('');
    setConfirmPassword('');
    setOldPassword('');
  };

  const handleCloseForgotPasswordDialog = () => {
    setOpenForgotPasswordDialog(false);
    setEmail('');
  };

  const handleChangePassword = async () => {
    const success = await changePassword(
      oldPassword,
      newPassword,
      confirmPassword,
    );
    if (success) {
      handleClosePasswordDialog();
      setNewPassword('');
      setConfirmPassword('');
      setOldPassword('');
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      alert('Please enter your email');
    } else {
      alert(`Password reset instructions sent to ${email}`);
      handleCloseForgotPasswordDialog();
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Navigate to={'/404'} />;
  }

  return (
    <Box sx={{ p: 4, mb: 4 }}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="end"
        sx={{ mb: 2, width: '100%' }}
      >
        {!isEdit && (
          <Button variant="contained" onClick={() => setIsEdit(true)}>
            Edit Profile
          </Button>
        )}
        <Button variant="outlined" onClick={() => setOpenPasswordDialog(true)}>
          Change Password
        </Button>
      </Stack>
      <Box sx={{ mb: 2 }}>
        <Typography
          color={'error'}
          textAlign="end"
          sx={{ cursor: 'pointer', fontStyle: 'italic' }}
          onClick={() => setOpenForgotPasswordDialog(true)}
        >
          Forgot password?
        </Typography>
      </Box>
      <Stack spacing={4} direction={'row'}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <AvatarUploader
            initialSrc={userInfo?.avatar || defaultImage}
            onChange={newAvatar => handleChange('avatar', newAvatar)}
          />
        </Box>

        <Stack spacing={2} sx={{ width: '100%' }}>
          <Stack direction={'column'} sx={{ width: '100%' }} spacing={2}>
            <TextField
              fullWidth
              disabled={!isEdit}
              label="Name"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              fullWidth
              disabled={!isEdit}
              label="Email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              disabled={!isEdit}
              label="Address"
              {...register('address')}
            />
            <TextField
              fullWidth
              disabled={!isEdit}
              label="Phone Number"
              {...register('phone', {
                pattern: {
                  value: /^[0-9]{10,12}$/,
                  message: 'Invalid phone number',
                },
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
            {isEdit && (
              <Stack
                direction="row"
                spacing={2}
                justifyContent={'end'}
                alignItems={'center'}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(handleSave)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setIsEdit(false)}
                >
                  Cancel
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                color={'error'}
                textAlign="end"
                sx={{ cursor: 'pointer', fontStyle: 'italic' }}
                onClick={() => {
                  handleClosePasswordDialog();
                  setOpenForgotPasswordDialog(true);
                }}
              >
                Forgot password?
              </Typography>
            </Box>
            <TextField
              label="Old Password"
              type={showOldPassword ? 'text' : 'password'}
              fullWidth
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowOldPassword(prev => !prev)}
                      edge="end"
                    >
                      {showOldPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              fullWidth
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(prev => !prev)}
                      edge="end"
                    >
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) {
                  setConfirmPasswordError(false);
                }
              }}
              error={confirmPasswordError}
              helperText={confirmPasswordError ? 'Passwords do not match' : ''}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openForgotPasswordDialog}
        onClose={handleCloseForgotPasswordDialog}
      >
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, width: '100%' }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPasswordDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleForgotPassword} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
