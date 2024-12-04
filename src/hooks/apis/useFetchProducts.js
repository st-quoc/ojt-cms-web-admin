import { useState, useEffect } from 'react';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';

const useFetchProducts = (page, rowsPerPage, filters) => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(`${API_ROOT}/admin/product/list`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          ...filters,
        },
      });
      setProducts(response.data.products);
      setTotalProducts(response.data.totalProducts);
    } catch (error) {
      setError('Error fetching products. Please try again later.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, filters]);

  return {
    products,
    totalProducts,
    loading,
    error,
    fetchProducts,
  };
};

export default useFetchProducts;
