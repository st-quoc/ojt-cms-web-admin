import { Helmet } from 'react-helmet-async';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CONFIG } from '../../config-global';
import { DashboardContent } from '../../layouts/dashboard/main';
import UserForm from './form';
import { Divider, Typography } from '@mui/material';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    phoneNumber: '',
    status: '',
  };

  const handleCreate = async values => {
    try {
      await axiosClient.post(`${API_ROOT}/admin/user/create`, values);
      navigate('/user');
      toast.success('User created successfully!');
    } catch {
      toast.error('Failed to create user!');
    }
  };

  return (
    <>
      <Helmet>
        <title> {`${CONFIG.appName} - Create new users `}</title>
      </Helmet>
      <DashboardContent>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Admin', path: '/' },
            { label: 'Users', path: '/users' },
          ]}
        />
        <Divider textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create new user
          </Typography>
        </Divider>
        <UserForm
          initialValues={initialValues}
          isEdit={false}
          onSubmit={handleCreate}
        />
      </DashboardContent>
    </>
  );
};

export default CreateUser;
