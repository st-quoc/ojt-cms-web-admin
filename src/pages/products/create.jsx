import { Typography, Divider, Box } from '@mui/material';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { toast } from 'react-toastify';
import { ProductForm } from './form';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';
import { useNavigate } from 'react-router-dom';

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
      navigate('/admin/products');
      toast.success('Product created successfully!');
    } catch (error) {
      console.error('🚀 Error creating product: ', error);
      toast.error('Error creating product!');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader
        breadcrumbs={[
          { label: 'Admin', path: '/admin' },
          { label: 'Products', path: '/admin/products' },
          { label: 'Create new product', path: `/admin/product/create` },
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
    </Box>
  );
};
