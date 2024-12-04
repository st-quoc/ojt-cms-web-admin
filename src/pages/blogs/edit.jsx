import { Typography, Divider, Box, CircularProgress } from '@mui/material';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { toast } from 'react-toastify';
import { BlogForm } from './form';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../../config/axios';
import { API_ROOT } from '../../constants';

export const BlogEditAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchblog = async () => {
      try {
        const response = await axiosClient.get(
          `${API_ROOT}/admin/blog/detail/${id}`,
        );
        setInitialValues(response.data.blog);
      } catch (error) {
        toast.error('Failed to fetch blog:');
      }
    };
    fetchblog();
  }, [id]);

  const onSubmit = async data => {
    const blogData = {
      thumbnail: data.thumbnail,
      title: data.title,
      sortDesc: data.sortDesc,
      fullDesc: data.fullDesc,
      status: data.status,
    };

    try {
      const res = await axiosClient.put(
        `${API_ROOT}/admin/blog/edit/${id}`,
        blogData,
      );
      navigate('/blogs');
      toast.success(`Blog: ${res.data.blog.name} edited successfully!`);
    } catch (error) {
      toast.error('Error editting blog!');
    }
  };

  if (!initialValues) {
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  }

  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader
        breadcrumbs={[
          { label: 'Admin', path: '/' },
          { label: 'Blogs', path: '/blogs' },
          { label: 'Create new blog', path: `/blog/create` },
        ]}
      />
      <Divider textAlign="center" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create new blog
        </Typography>
      </Divider>

      <BlogForm isEdit onSubmit={onSubmit} initialValues={initialValues} />
    </Box>
  );
};
