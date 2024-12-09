import { Helmet } from 'react-helmet-async';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CONFIG } from '../../config-global';
import { DashboardContent } from '../../layouts/dashboard/main';
import ManagerForm from './form';
import { Divider, Typography } from '@mui/material';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateManager = () => {
  const navigate = useNavigate();
  const initialValues = {
    name: '',
    email: '',
    phoneNumber: '',
    status: '',
    permissions: [],
  };

  const handleCreate = async values => {
    try {
      await axiosClient.post(`${API_ROOT}/admin/manager/create`, values);
      navigate('/managers');
      toast.success('Manager created succsessfully!');
    } catch (error) {
      toast.success('Manager creating failed!');
    }
  };

  return (
    <>
      <Helmet>
        <title> {`${CONFIG.appName} - Create new managers `}</title>
      </Helmet>
      <DashboardContent>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Admin', path: '/' },
            { label: 'Managers', path: '/managers' },
          ]}
        />
        <Divider textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create new manager
          </Typography>
        </Divider>
        <ManagerForm
          initialValues={initialValues}
          isEdit={false}
          onSubmit={handleCreate}
        />
      </DashboardContent>
    </>
  );
};

export default CreateManager;
