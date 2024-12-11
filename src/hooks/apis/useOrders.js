import { useState, useEffect } from 'react';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';

const useFetchOrders = (page, rowsPerPage, filters) => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(`${API_ROOT}/admin/order/list`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          ...filters,
        },
      });
      setOrders(response.data.orders);
      setTotalOrders(response.data.totalOrders);
    } catch (error) {
      setError('Error fetching orders. Please try again later.');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage, filters]);

  return {
    orders,
    totalOrders,
    loading,
    error,
    fetchOrders,
  };
};

export default useFetchOrders;
