import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Typography,
  Stack,
} from '@mui/material';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ORDERS_PER_PAGE = 10;

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8017/v1/admin/orders');
      const filteredOrders = statusFilter
        ? response.data.filter(order => order.orderStatus === statusFilter)
        : response.data;

      setOrders(
        filteredOrders.slice(
          (currentPage - 1) * ORDERS_PER_PAGE,
          currentPage * ORDERS_PER_PAGE,
        ),
      );
      setTotalPages(Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8017/v1/admin/orders/${orderId}`,
        {
          orderStatus: newStatus,
        },
      );
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? response.data : order,
        ),
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleFilterChange = status => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentPage]);

  return (
    <Box
      sx={{ padding: '2rem', backgroundColor: '#f9f9f9', minHeight: '100vh' }}
    >
      <Typography
        variant="h4"
        sx={{ marginBottom: '2rem', fontWeight: 'bold', color: '#333' }}
      >
        Order Management
      </Typography>
      <Stack direction="row" spacing={2} sx={{ marginBottom: '1.5rem' }}>
        <Button
          variant={statusFilter === '' ? 'contained' : 'outlined'}
          onClick={() => handleFilterChange('')}
        >
          All
        </Button>
        {['processing', 'shipped', 'delivered', 'cancelled'].map(status => (
          <Button
            key={status}
            variant={statusFilter === status ? 'contained' : 'outlined'}
            onClick={() => handleFilterChange(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </Stack>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Day</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(order => (
                <TableRow key={order._id} hover>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{order.phoneNumber}</TableCell>
                  <TableCell>{order.user?.name || 'N/A'}</TableCell>
                  <TableCell>{order.totalPrice}</TableCell>
                  <TableCell>{order.orderStatus}</TableCell>
                  <TableCell>
                    <Select
                      value={order.orderStatus}
                      onChange={e =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default OrderList;
