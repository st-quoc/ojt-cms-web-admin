import { Helmet } from 'react-helmet-async';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CONFIG } from '../../config-global';
import { DashboardContent } from '../../layouts/dashboard/main';
import TierForm from './form';
import { Divider, Typography } from '@mui/material';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateTier = () => {
  const navigate = useNavigate();

  const initialValues = {
    image: '',
    name: '',
    minSpent: '',
    maxSpent: '',
    description: '',
  };

  const handleCreate = async values => {
    try {
      await axiosClient.post(`${API_ROOT}/admin/tier/create`, values);
      navigate('/tiers');
      toast.success('Tier created successfully!');
    } catch {
      toast.error('Failed to create tier!');
    }
  };

  return (
    <>
      <Helmet>
        <title> {`${CONFIG.appName} - Create new tier `}</title>
      </Helmet>
      <DashboardContent>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Admin', path: '/' },
            { label: 'Tiers', path: '/tiers' },
          ]}
        />
        <Divider textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create new tier
          </Typography>
        </Divider>
        <TierForm
          initialValues={initialValues}
          isEdit={false}
          onSubmit={handleCreate}
        />
      </DashboardContent>
    </>
  );
};

export default CreateTier;
