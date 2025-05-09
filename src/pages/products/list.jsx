import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import { ProductsFilter } from './filter';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Typography,
  CircularProgress,
  Collapse,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import { DashboardContent } from '../../layouts/dashboard/main';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../../config-global';
import useFetchProducts from '../../hooks/apis/useFetchProducts';
import ConfirmDeleteModal from '../../components/ModalConfirmDelete';
import { toast } from 'react-toastify';

function Row(props) {
  const navigate = useNavigate();
  const { row, handleOpenDialog } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">
          <img
            src={row.images[0]}
            alt={row.name}
            style={{
              width: 50,
              height: 50,
              objectFit: 'cover',
            }}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="left">
          {row.categories?.map((cate, index) => (
            <Chip key={index} label={cate} />
          ))}
        </TableCell>
        <TableCell align="center">
          <Stack direction="row" spacing={1}>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => handleOpenDialog(row.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => navigate(`/product/edit/${row.id}`)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Detail">
              <IconButton onClick={() => navigate(`/product/detail/${row.id}`)}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                <strong>Variants</strong>
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <strong>Color</strong>
                    </TableCell>
                    <TableCell align="left">
                      <strong>Size</strong>
                    </TableCell>
                    <TableCell align="left">
                      <strong>Stock</strong>
                    </TableCell>
                    <TableCell align="left">
                      <strong>Price</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.variants &&
                    row.variants.length > 0 &&
                    row.variants.map((variant, index) => (
                      <TableRow key={index}>
                        <TableCell>{variant.color}</TableCell>
                        <TableCell>{variant.size}</TableCell>
                        <TableCell>{variant.stock}</TableCell>
                        <TableCell>{variant.price}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const ProductsListAdmin = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpenDel, setModalOpenDel] = useState(false);
  const [itemDel, setItemDel] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: [],
    priceMin: 0,
    priceMax: 999999999,
    color: [],
    size: [],
    stockCondition: '>',
    stockValue: 0,
  });

  const { products, totalProducts, loading, error, fetchProducts } =
    useFetchProducts(page, rowsPerPage, filters);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenModalDel = id => {
    setItemDel(id);
    setModalOpenDel(true);
  };
  const handleCloseModalDel = () => setModalOpenDel(false);

  const handleConfirmDel = async () => {
    try {
      await axiosClient.delete(`${API_ROOT}/admin/product/delete/${itemDel}`);
      setItemDel(null);
      fetchProducts();
      toast.success('Deleted product succsessfully!');
    } catch (error) {
      toast.error('Delete product failed!');
    }
    handleCloseModalDel();
  };

  return (
    <>
      <Helmet>
        <title> {`${CONFIG.appName} - Products list management `}</title>
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
          <ProductsFilter filters={filters} setFilters={setFilters} />
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
            {products.length === 0 ? (
              <Typography variant="h6" color="textSecondary" align="center">
                No products available.
              </Typography>
            ) : (
              <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={3}>
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell>
                          <strong>Images</strong>
                        </TableCell>
                        <TableCell align="left">
                          <strong>Name</strong>
                        </TableCell>
                        <TableCell align="left">
                          <strong>Categories</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map(row => (
                        <Row
                          key={row.id}
                          row={row}
                          handleOpenDialog={handleOpenModalDel}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={totalProducts}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            )}
          </>
        )}

        <ConfirmDeleteModal
          open={isModalOpenDel}
          onConfirm={handleConfirmDel}
          onCancel={handleCloseModalDel}
        />
      </DashboardContent>
    </>
  );
};
export default ProductsListAdmin;
