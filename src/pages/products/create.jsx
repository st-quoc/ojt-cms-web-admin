import { Typography, Divider } from '@mui/material';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { toast } from 'react-toastify';
import { ProductForm } from './form';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { DashboardContent } from '../../layouts/dashboard/main';
import { CONFIG } from '../../config-global';
import { Helmet } from 'react-helmet-async';

export const ProductCreateAdmin = () => {
  const navigate = useNavigate();

  const onSubmit = async data => {
    const productData = {
      name: data.name,
      sortDesc: data.sortDesc,
      fullDesc: data.fullDesc,
      categories: data.categories,
      images: data.images,
      variants: data.variants,
    };

    try {
      await axiosClient.post(`${API_ROOT}/admin/product/create`, productData);
      navigate('/products');
      toast.success('Product created successfully!');
    } catch {
      toast.error('Error creating product!');
    }
  };

  return (
    <>
      <Helmet>
        <title> {`${CONFIG.appName} - Create new product `}</title>
      </Helmet>
      <DashboardContent>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Admin', path: '/' },
            { label: 'Products', path: '/products' },
            { label: 'Create new product', path: `/product/create` },
          ]}
        />

        <Divider textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create new product
          </Typography>
        </Divider>

        <ProductForm
          onSubmit={onSubmit}
          defaultValues={{
            name: '',
            sortDesc: '',
            fullDesc: '',
            categories: [],
            images: [],
            variants: [
              {
                size: '',
                color: '',
                price: '',
                stock: '',
              },
            ],
          }}
        />
      </DashboardContent>
    </>
  );
};
