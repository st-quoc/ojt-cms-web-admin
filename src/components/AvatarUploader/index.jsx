import { Avatar } from '@files-ui/react';
import { useState } from 'react';
import axiosClient from '../../config/axios';
import { API_ROOT } from '../../constants';
import { toast } from 'react-toastify';

export const AvatarUploader = ({ initialSrc }) => {
  const [imageSource, setImageSource] = useState(initialSrc);
  const [loading, setLoading] = useState(false);

  const handleChangeSource = async selectedFile => {
    setLoading(true);

    const reader = new FileReader();

    reader.onloadend = async () => {
      const imageUrl = reader.result;

      setImageSource(imageUrl);

      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append('avatar', selectedFile);

          const response = await axiosClient.post(
            `${API_ROOT}/auth/avatar`,
            formData,
          );

          if (response.status === 200) {
            toast.success('Avatar uploaded successfully');
          } else {
            toast.error('Error uploading avatar');
          }
        } catch {
          toast.error('Error uploading avatar');
        } finally {
          setLoading(false);
        }
      }
    };

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Avatar
      isLoading={loading}
      emptyLabel={'You can choose an image...'}
      loadingLabel={
        loading
          ? 'Uploading avatar, please wait...'
          : 'You can drink a cup of coffee in the meanwhile'
      }
      changeLabel="Edit Avatar"
      src={imageSource}
      alt="Avatar"
      onChange={handleChangeSource}
    />
  );
};
