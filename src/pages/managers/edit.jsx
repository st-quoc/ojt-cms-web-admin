import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ManagerForm from './form';
import CircularProgress from '@mui/material/CircularProgress';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';
import { toast } from 'react-toastify';
import { Divider, Typography } from '@mui/material';
import { DashboardContent } from '../../layouts/dashboard/main';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CONFIG } from '../../config-global';
import { Helmet } from 'react-helmet-async';

const EditManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    try {
      await axiosClient.put(`${API_ROOT}/admin/manager/edit/${id}`, values);
      navigate(`/managers`);
      toast.success('Manager created succsessfully!');
    } catch (error) {
      toast.error('Error when updating manager');
    }
  };

  if (!initialValues) {
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  }

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
            { label: initialValues.name },
          ]}
        />
        <Divider textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            {initialValues.name}
          </Typography>
        </Divider>
        <ManagerForm
          initialValues={initialValues}
          isEdit={true}
          onSubmit={handleUpdate}
        />
      </DashboardContent>
    </>
  );
};

export default EditManager;
