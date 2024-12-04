import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';
import TierForm from './form';
import { DashboardContent } from '../../layouts/dashboard/main';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CONFIG } from '../../config-global';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

const EditTier = () => {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchTier = async () => {
      try {
        const response = await axiosClient.get(
          `${API_ROOT}/admin/tier/detail/${id}`,
        );
        setInitialValues(response.data);
      } catch (error) {
        toast.error('Failed to fetch tier:');
      }
    };
    fetchTier();
  }, [id]);

  const handleUpdate = async values => {
    await axiosClient.put(`/api/users/${id}`, values);
  };

  if (!initialValues) {
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  }

  return (
    <>
      <Helmet>
        <title>{`${CONFIG.appName} - Tiers List`}</title>
      </Helmet>
      <DashboardContent>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Admin', path: '/' },
            { label: 'Tiers', path: '/tiers' },
            { label: initialValues.name },
          ]}
        />

        <TierForm
          initialValues={initialValues}
          isEdit={true}
          onSubmit={handleUpdate}
        />
      </DashboardContent>
    </>
  );
};

export default EditTier;
