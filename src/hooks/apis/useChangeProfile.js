import { useState } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../config/axios';

const useChangeProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const changeProfile = async updatedUserInfo => {
    setLoading(true);
    try {
      const response = await axiosClient.post(
        '/api/user/update-profile',
        updatedUserInfo,
      );

      if (response.status === 200) {
        toast.success('Profile updated successfully');
        return response.data;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { changeProfile, loading, error };
};

export default useChangeProfile;
