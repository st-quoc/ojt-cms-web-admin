import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';
import UserForm from './form';
import { DashboardContent } from '../../layouts/dashboard/main';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CONFIG } from '../../config-global';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get(
          `${API_ROOT}/admin/user/detail/${id}`,
        );
        setInitialValues(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, [id]);

  const handleUpdate = async values => {
    try {
      await axiosClient.put(`${API_ROOT}/admin/user/edit/${id}`, values);
      navigate(`/users`);
      toast.success('User updated succsessfully!');
    } catch (error) {
      toast.error('Error when updating user');
    }
  };

  if (!initialValues) {
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  }

  return (
    <>
      <Helmet>
        <title>{`${CONFIG.appName} - Users List`}</title>
      </Helmet>
      <DashboardContent>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Admin', path: '/' },
            { label: 'Users', path: '/users' },
            { label: initialValues.name },
          ]}
        />

        <UserForm
          initialValues={initialValues}
          isEdit={true}
          onSubmit={handleUpdate}
        />
      </DashboardContent>
    </>
  );
};

export default EditUser;
