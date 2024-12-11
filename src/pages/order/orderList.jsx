import React, { useState } from 'react';
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
  TablePagination,
  CircularProgress,
} from '@mui/material';
import useOrders from '../../hooks/apis/useOrders';
import useFetchOrders from '../../hooks/apis/useOrders';
import { Helmet } from 'react-helmet-async';
import { DashboardContent } from '../../layouts/dashboard/main';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CONFIG } from '../../config-global';
import { ProductsFilter } from '../products/filter';
import { OrdersFilter } from './filters';

const OrderList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    status: null,
    startDate: null,
    endDate: null,
  });

  const { orders, totalOrders, loading, error, fetchOrders } = useFetchOrders(
    page,
    rowsPerPage,
    filters,
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Helmet>
        <title> {`${CONFIG.appName} - Orders list management `}</title>
      </Helmet>
      <DashboardContent>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Admin', path: '/' },
            { label: 'Products', path: '/products' },
          ]}
          buttons={[
            {
              label: 'Add Product',
              onClick: () => navigate('/product/create'),
              variant: 'contained',
              color: 'primary',
            },
          ]}
        />
        <Box sx={{ my: 3 }}>
          <OrdersFilter filters={filters} setFilters={setFilters} />
        </Box>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Navigate to="/404" />
        ) : (
          <>
            {orders.length === 0 ? (
              <Typography variant="h6" color="textSecondary" align="center">
                No products available.
              </Typography>
            ) : (
              <>
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
                      {orders.map(order => (
                        <TableRow key={order._id} hover>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'long',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              },
                            )}
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
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={totalOrders}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </>
        )}
      </DashboardContent>
    </>
  );
};

export default OrderList;
