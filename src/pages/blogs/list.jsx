import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import { useMemo, useState, useEffect } from 'react';
import { Button, Divider, Stack, Modal, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CloudinaryMultipleUploader } from '../../components/CloudinaryMultipleUploader';
import axios from 'axios';
import { API_ROOT } from '../../constants';
import { toast } from 'react-toastify';

const headCells = [
  {
    id: 'thumbnail',
    numeric: false,
    disablePadding: false,
    label: 'Thumbnail',
  },
  { id: 'title', numeric: false, disablePadding: false, label: 'Title' },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description',
  },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Date Created',
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const EnhancedTableHead = props => {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all blogs' }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const EnhancedTableToolbar = props => {
  const { numSelected, onAddNewBlog } = props;

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: theme =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Blogs
        </Typography>
      )}
      {numSelected > 0 ? (
        <Stack direction="row">
          <Button size="small">Delete</Button>
          <Button size="small">Export</Button>
        </Stack>
      ) : (
        <Button
          size="small"
          variant="contained"
          sx={{ w: 250 }}
          onClick={onAddNewBlog}
        >
          Add new blog
        </Button>
      )}
    </Toolbar>
  );
};

export const BlogsListAdmin = () => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [blogs, setBlogs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const { handleSubmit, control, reset } = useForm();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_ROOT}/admin/blog/list`);
        if (response.data.success) {
          setBlogs(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = blogs.map(n => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddNewBlog = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    reset();
  };

  const onSubmit = async data => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        images: data.images,
      };

      const response = await axios.post(
        `${API_ROOT}/admin/blog/create`,
        payload,
      );

      if (response.data.success) {
        toast.success('Blog created successfully!');
        setBlogs(prevBlogs => [...prevBlogs, response.data.blog]);
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Error creating blog');
      console.error('Error creating blog:', error);
    }
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - blogs.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...blogs]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, blogs],
  );

  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader
        breadcrumbs={[
          { label: 'Admin', path: '/admin' },
          { label: 'Blogs', path: '/admin/blogs' },
        ]}
      />
      <Divider textAlign="center" />
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onAddNewBlog={handleAddNewBlog}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={blogs.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={event => handleSelectAllClick(event, row._id)}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {row.images?.[0] ? (
                        <img
                          src={row.images[0]}
                          alt="Thumbnail"
                          style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                      ) : (
                        'No Image'
                      )}
                    </TableCell>

                    <TableCell component="th" id={labelId} scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      {new Date(row.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={blogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Create New Blog
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="Title" fullWidth />
                )}
              />
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="Description" fullWidth />
                )}
              />
              <Controller
                name="images"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <CloudinaryMultipleUploader
                    images={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />

              <Button type="submit" variant="contained" fullWidth>
                Create Blog
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};
