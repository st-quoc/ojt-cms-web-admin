import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { Divider } from '@mui/material';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { toast } from 'react-toastify';
import { BlogForm } from './form';
import axiosClient from '../../config/axios';
import { API_ROOT } from '../../constants';
import { useNavigate } from 'react-router-dom';

export const BlogCreateAdmin = () => {
  const navigate = useNavigate();

  const onSubmit = async data => {
    const blogData = {
      thumbnail: data.thumbnail,
      title: data.title,
      sortDesc: data.sortDesc,
      fullDesc: data.fullDesc,
      status: data.status || 'draft',
    };

    try {
      await axiosClient.post(`${API_ROOT}/admin/blog/create`, blogData);
      navigate('/blogs');
      toast.success('Blog created successfully!');
    } catch {
      toast.error('Failed to create blog!');
    }
  };

  return (
    <Box>
      <AdminPageHeader
        breadcrumbs={[
          { label: 'Admin', path: `/` },
          { label: 'Blogs', path: `/blogs` },
          { label: 'Create New Blog', path: `/blogs/create` },
        ]}
      />
      <Divider textAlign="center" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Blog
        </Typography>
      </Divider>

      <BlogForm
        onSubmit={onSubmit}
        initialValues={{
          thumbnail: '',
          title: '',
          sortDesc: '',
          fullDesc: '',
          status: 'draft',
        }}
      />
    </Box>
  );
};

export default BlogCreateAdmin;
