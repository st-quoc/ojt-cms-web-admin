import axios from 'axios';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { Divider } from '@mui/material';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { toast } from 'react-toastify';
import { BlogForm } from './form';

export const BlogCreateAdmin = () => {
  const onSubmit = async data => {
    const blogData = {
      title: data.title,
      thumbnail: data.thumbnail,
      categories: data.categories || [],
      status: data.status || 'Draft',
    };

    try {
      await axios.post(`/api/blogs`, blogData);
      toast.success('Blog created successfully!');
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error('Failed to create blog!');
    }
  };

  return (
    <Box>
      <AdminPageHeader
        breadcrumbs={[
          { label: 'Admin', path: `/admin` },
          { label: 'Blogs', path: `/admin/blogs` },
          { label: 'Create New Blog', path: `/admin/blogs/create` },
        ]}
      />
      <Divider textAlign="center" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Blog
        </Typography>
      </Divider>

      <BlogForm
        onSubmit={onSubmit}
        defaultValues={{
          title: '',
          thumbnail: '',
          categories: [],
          status: 'Draft',
        }}
      />
    </Box>
  );
};

export default BlogCreateAdmin;
