import { Helmet } from 'react-helmet-async';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CONFIG } from '../../config-global';
import { DashboardContent } from '../../layouts/dashboard/main';
import ManagerForm from './form';
import { Divider, Typography } from '@mui/material';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';

const CreateManager = () => {
  const initialValues = {
    name: '',
    email: '',
    phoneNumber: '',
    status: '',
    permissions: [],
  };

  const handleCreate = async values => {
    await axiosClient.post(`${API_ROOT}/admin/manager/create`, values);
  };

  return (
    <>
      <Helmet>
        <title> {`${CONFIG.appName} - Create new managers `}</title>
      </Helmet>
      <DashboardContent>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Admin', path: '/admin' },
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
