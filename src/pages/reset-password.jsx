import { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ROOT } from '../constants';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Password and confirm password do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_ROOT}/auth/reset-password/${token}`,
        {
          newPassword,
        },
      );

      if (response.status === 200) {
        toast.success('Password has been successfully changed!');
        navigate('/login');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5">Reset password</Typography>
          <Box sx={{ mt: 1 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="New password"
                type="password"
                autoFocus
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              {error && <Typography color="error">{error}</Typography>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Reset Password'}
              </Button>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
