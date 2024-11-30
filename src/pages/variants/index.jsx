import { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TablePagination,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { API_ROOT } from '../../constants';
import axiosClient from '../../config/axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalCreateCategory from '../../components/modal/category';
import ModalCreateColor from '../../components/modal/color';
import ModalCreateSize from '../../components/modal/size';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { toast } from 'react-toastify';
import { DashboardContent } from '../../layouts/dashboard/main';

export const VariantsPage = () => {
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [categoryPage, setCategoryPage] = useState(0);
  const [colorPage, setColorPage] = useState(0);
  const [sizePage, setSizePage] = useState(0);

  const [categoryRowsPerPage, setCategoryRowsPerPage] = useState(5);
  const [colorRowsPerPage, setColorRowsPerPage] = useState(5);
  const [sizeRowsPerPage, setSizeRowsPerPage] = useState(5);

  const [totalCategories, setTotalCategories] = useState(0);
  const [totalColors, setTotalColors] = useState(0);
  const [totalSizes, setTotalSizes] = useState(0);

  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openColorModal, setOpenColorModal] = useState(false);
  const [openSizeModal, setOpenSizeModal] = useState(false);

  const [currentTab, setCurrentTab] = useState(
    localStorage.getItem('v_admin_tab') ?? 0,
  );
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({ type: '', id: null });

  const [currentEditItem, setCurrentEditItem] = useState(null);

  const [categorySearch, setCategorySearch] = useState('');
  const [colorSearch, setColorSearch] = useState('');
  const [sizeSearch, setSizeSearch] = useState('');

  useEffect(() => {
    fetchCategories(categoryPage, categoryRowsPerPage, categorySearch);
    fetchColors(colorPage, colorRowsPerPage, colorSearch);
    fetchSizes(sizePage, sizeRowsPerPage, sizeSearch);
  }, [
    categoryPage,
    colorPage,
    sizePage,
    categorySearch,
    colorSearch,
    sizeSearch,
  ]);

  useEffect(() => {
    const savedTab = localStorage.getItem('v_admin_tab');
    if (savedTab !== null) {
      setCurrentTab(Number(savedTab));
    }
  }, []);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
    localStorage.setItem('v_admin_tab', newValue);
  };

  const fetchCategories = async (page, limit, search = '') => {
    try {
      const response = await axiosClient.get(
        `${API_ROOT}/admin/category/list?page=${page + 1}&limit=${limit}&search=${search}`,
      );
      const { categories, total } = response.data;
      setCategories(categories);
      setTotalCategories(total);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchColors = async (page, limit, search = '') => {
    try {
      const response = await axiosClient.get(
        `${API_ROOT}/admin/color/list?page=${page + 1}&limit=${limit}&search=${search}`,
      );
      const { colors, total } = response.data;
      setColors(colors);
      setTotalColors(total);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchSizes = async (page, limit, search = '') => {
    try {
      const response = await axiosClient.get(
        `${API_ROOT}/admin/size/list?page=${page + 1}&limit=${limit}&search=${search}`,
      );
      const { sizes, total } = response.data;
      setSizes(sizes);
      setTotalSizes(total);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const handleDeleteItem = (type, id) => {
    setCurrentItem({ type, id });
    setOpenConfirmModal(true);
  };

  const confirmDeleteItem = async () => {
    try {
      await axiosClient.delete(
        `${API_ROOT}/admin/${currentItem.type}/delete/${currentItem.id}`,
      );
      if (currentItem.type === 'category')
        fetchCategories(categoryPage, categoryRowsPerPage);
      if (currentItem.type === 'color')
        fetchColors(colorPage, colorRowsPerPage);
      if (currentItem.type === 'size') fetchSizes(sizePage, sizeRowsPerPage);

      toast.success(
        `${currentItem.type.charAt(0).toUpperCase() + currentItem.type.slice(1)} deleted successfully`,
      );
      setOpenConfirmModal(false);
    } catch {
      toast.error(`Failed to delete ${currentItem.type}. Please try again.`);
    }
  };

  const renderTable = (
    title,
    rows,
    columns,
    total,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    onCreate,
    fetchData,
    type,
    searchValue,
    setSearchValue,
  ) => (
    <Paper elevation={3} sx={{ display: 'flex', flex: 1 }}>
      <Stack spacing={2} p={2} sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <TextField
              variant="outlined"
              size="small"
              placeholder={`Search ${title}`}
              value={searchValue}
              onChange={e => {
                setSearchValue(e.target.value);
                fetchData(0, rowsPerPage, e.target.value);
              }}
              sx={{ width: '100%' }}
            />
          </Box>
          <Button variant="contained" onClick={onCreate} size="small">
            Create {title}
          </Button>
        </Stack>

        <TableContainer>
          <Table sx={{ width: '100%' }} aria-label={`${title} table`}>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell key={column} align="left">
                    {column}
                  </TableCell>
                ))}
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map(column => (
                    <TableCell key={column} align="left">
                      {column.toLowerCase() === 'thumbnail' ? (
                        <img
                          src={row[column.toLowerCase()]}
                          alt="Thumbnail"
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        row[column.toLowerCase()] || '-'
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="left">
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setCurrentEditItem(row);
                          if (type === 'category') setOpenCategoryModal(true);
                          if (type === 'color') setOpenColorModal(true);
                          if (type === 'size') setOpenSizeModal(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteItem(type, row._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={(event, newPage) => {
            setPage(newPage);
            fetchData(newPage, rowsPerPage, searchValue);
          }}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={event => {
            const newRowsPerPage = parseInt(event.target.value, 10);
            setRowsPerPage(newRowsPerPage);
            setPage(0);
            fetchData(0, newRowsPerPage, searchValue);
          }}
        />
      </Stack>
    </Paper>
  );

  return (
    <DashboardContent>
      <AdminPageHeader
        breadcrumbs={[
          { label: 'Admin', path: '/' },
          { label: 'Variants', path: '/variants' },
        ]}
      />
      <Dialog
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this {currentItem.type}? This action
          cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteItem} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ModalCreateCategory
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
        onCreate={() => fetchCategories(categoryPage, categoryRowsPerPage)}
        initialValues={currentEditItem}
      />
      <ModalCreateColor
        open={openColorModal}
        onClose={() => setOpenColorModal(false)}
        onCreate={() => fetchColors(colorPage, colorRowsPerPage)}
        initialValues={currentEditItem}
      />
      <ModalCreateSize
        open={openSizeModal}
        onClose={() => setOpenSizeModal(false)}
        onCreate={() => fetchSizes(sizePage, sizeRowsPerPage)}
        initialValues={currentEditItem}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={currentTab} onChange={handleChangeTab}>
          <Tab label="Categories" />
          <Tab label="Colors" />
          <Tab label="Sizes" />
        </Tabs>
      </Box>

      {currentTab === 0 &&
        renderTable(
          'Categories',
          categories,
          ['Thumbnail', 'Name', 'Description'],
          totalCategories,
          categoryPage,
          categoryRowsPerPage,
          setCategoryPage,
          setCategoryRowsPerPage,
          () => setOpenCategoryModal(true),
          fetchCategories,
          'category',
          categorySearch,
          setCategorySearch,
        )}
      {currentTab === 1 &&
        renderTable(
          'Colors',
          colors,
          ['Name'],
          totalColors,
          colorPage,
          colorRowsPerPage,
          setColorPage,
          setColorRowsPerPage,
          () => setOpenColorModal(true),
          fetchColors,
          'color',
          colorSearch,
          setColorSearch,
        )}
      {currentTab === 2 &&
        renderTable(
          'Sizes',
          sizes,
          ['Name'],
          totalSizes,
          sizePage,
          sizeRowsPerPage,
          setSizePage,
          setSizeRowsPerPage,
          () => setOpenSizeModal(true),
          fetchSizes,
          'size',
          sizeSearch,
          setSizeSearch,
        )}
    </DashboardContent>
  );
};

export default VariantsPage;
