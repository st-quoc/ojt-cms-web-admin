import { useState, useEffect } from 'react';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';

const useFetchBlogDetail = id => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogDetail = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`${API_ROOT}/admin/blog/detail/${id}`);
      setBlog(response.data.blog);
    } catch (err) {
      setError(err.message || 'Failed to fetch blog details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  return { blog, loading, error, fetchBlogDetail };
};

export default useFetchBlogDetail;
