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
import { useState } from 'react';
import useChangeProfile from '../../hooks/apis/useChangeProfile';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useChangePassword from '../../hooks/apis/useChangePassword';

export const ProfileTab = () => {
  const { userInfo, loading, error } = useFetchProfile();
  const { changeProfile, loading: saveLoading } = useChangeProfile();
  const {
    changePassword,
    loading: changeLoading,
    error: changeError,
  } = useChangePassword();

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

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  const handleChange = (key, value) => {
    userInfo[key] = value;
  };

  const handleSave = async () => {
    try {
      await changeProfile(userInfo);
      setIsEdit(false);
    } catch (err) {
      toast.error('An error occurred while editing profile!');
    }
  };

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setNewPassword('');
    setConfirmPassword('');
    setOldPassword('');
  };

  const handleOpenForgotPasswordDialog = () => {
    setOpenForgotPasswordDialog(true);
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
          <Button variant="contained" onClick={handleEdit}>
            Edit Profile
          </Button>
        )}
        <Button variant="outlined" onClick={handleOpenPasswordDialog}>
          Change Password
        </Button>
      </Stack>
      <Box sx={{ mb: 2 }}>
        <Typography
          color={'error'}
          textAlign="end"
          sx={{ cursor: 'pointer', fontStyle: 'italic' }}
          onClick={handleOpenForgotPasswordDialog}
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
              value={userInfo?.name || ''}
              onChange={e => handleChange('name', e.target.value)}
            />
            <TextField
              fullWidth
              disabled={!isEdit}
              label="Email"
              value={userInfo?.email || ''}
              onChange={e => handleChange('email', e.target.value)}
            />
            <TextField
              fullWidth
              disabled={!isEdit}
              label="Address"
              value={userInfo?.address || ''}
              onChange={e => handleChange('address', e.target.value)}
            />
            <TextField
              fullWidth
              disabled={!isEdit}
              label="Phone Number"
              value={userInfo?.phone || ''}
              onChange={e => handleChange('phone', e.target.value)}
            />
            <Stack
              direction="row"
              spacing={2}
              justifyContent={'end'}
              alignItems={'center'}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={saveLoading}
              >
                {saveLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Stack>
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
                  handleOpenForgotPasswordDialog();
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
