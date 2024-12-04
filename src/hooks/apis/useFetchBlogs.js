import { useState, useEffect } from 'react';
import axiosClient from '../../config/axios';
import { API_ROOT } from '../../constants';

const useFetchBlogs = (page, rowsPerPage, search) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosClient.get(`${API_ROOT}/admin/blog/list`, {
          params: {
            page: page + 1,
            limit: rowsPerPage,
            search,
          },
        });

        setBlogs(response.data.blogs);
        setTotalItems(response.data.pagination.totalItems);
      } catch (err) {
        setError(err.message || 'Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return { blogs, loading, error, totalItems };
};

export default useFetchBlogs;
