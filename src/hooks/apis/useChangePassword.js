import { useState } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../config/axios';
import { API_ROOT } from '../../constants';

const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.post(`${API_ROOT}/auth/change-password`, {
        oldPassword,
        newPassword,
      });

      if (response.status === 200) {
        toast.success('Password changed successfully');
        return true;
      } else {
        throw new Error('Failed to change password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      toast.error(err.response?.data?.message || 'Failed to change password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, error };
};

export default useChangePassword;
