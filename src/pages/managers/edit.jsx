import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ManagerForm from './form';
import CircularProgress from '@mui/material/CircularProgress';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';

const EditManager = () => {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const response = await axiosClient.get(
          `${API_ROOT}/admin/manager/detail/${id}`,
        );
        setInitialValues(response.data.manager);
      } catch (error) {
        console.error('Failed to fetch manager:', error);
      }
    };
    fetchManager();
  }, [id]);

  const handleUpdate = async values => {
    await axios.put(`/api/managers/${id}`, values);
  };

  if (!initialValues) {
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  }

  return (
    <ManagerForm
      initialValues={initialValues}
      isEdit={true}
      onSubmit={handleUpdate}
    />
  );
};

export default EditManager;
