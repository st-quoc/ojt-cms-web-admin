import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CONFIG } from '../../config-global';
import { Helmet } from 'react-helmet-async';
import { DashboardContent } from '../../layouts/dashboard/main';
import { Box, Chip, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useFetchBlogs from '../../hooks/apis/useFetchBlogs';
import ConfirmDeleteModal from '../../components/ModalConfirmDelete';
import axiosClient from '../../config/axios';
import { toast } from 'react-toastify';
import { API_ROOT } from '../../constants';
import ConfirmChangeStatusModal from '../../components/ModalConfirmChangeStatus';

const headCells = [
  { id: 'thumbnail', label: 'Thumbnail' },
  { id: 'title', label: 'Title' },
  { id: 'sortDesc', label: 'Sort Desc' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Date Created' },
  { id: 'actions', label: 'Actions' },
];

export const BlogsListAdmin = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const [isModalOpenDel, setModalOpenDel] = useState(false);
  const [itemDel, setItemDel] = useState(null);

  const [isModalOpenChangeStt, setModalOpenChangeStt] = useState(false);
  const [itemChangeStt, setItemChangeStt] = useState(null);

  const { blogs, loading, totalItems, fetchBlogs } = useFetchBlogs(
    page,
    rowsPerPage,
    search,
  );

  const handleOpenModalDel = id => {
    setItemDel(id);
    setModalOpenDel(true);
  };
  const handleCloseModalDel = () => setModalOpenDel(false);

  const handleConfirmDel = async () => {
    try {
      await axiosClient.delete(`${API_ROOT}/admin/blog/delete/${itemDel}`);
      setItemDel(null);
      fetchBlogs();
      toast.success('Deleted blog succsessfully!');
    } catch (error) {
      toast.error('Delete blog failed!');
    }
    handleCloseModalDel();
  };

  const handleOpenModalChangeStt = id => {
    setItemChangeStt(id);
    setModalOpenChangeStt(true);
  };
  const handleCloseModalChangeStt = () => setModalOpenChangeStt(false);

  const handleConfirmChangeStt = async () => {
    try {
      await axiosClient.put(
        `${API_ROOT}/admin/blog/change-status/${itemChangeStt}`,
      );
      setItemChangeStt(null);
      fetchBlogs();
      toast.success('Change status blog succsessfully!');
    } catch (error) {
      toast.error('Change status blog failed!');
    }
    handleCloseModalChangeStt();
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = event => {
    setSearch(event.target.value);
    setPage(0);
  };

  const getStatusChip = status => {
    let color = 'default';
    let label = status;

    if (status === 'public') {
      color = 'success';
      label = 'Public';
    } else if (status === 'draft') {
      color = 'error';
      label = 'Draft';
    } else {
      color = 'default';
      label = 'Unknown';
    }

    return <Chip label={label} color={color} />;
  };

  return (
    <>
      <Helmet>
        <title>{`${CONFIG.appName} - Blogs List`}</title>
      </Helmet>
      <DashboardContent>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Admin', path: '/' },
            { label: 'Blogs', path: '/blogs' },
          ]}
          buttons={[
            {
              label: 'Add Blog',
              onClick: () => navigate('/blogs/create'),
              variant: 'contained',
              color: 'primary',
            },
          ]}
        />
        <Box sx={{ width: '100%', mb: 2, p: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={search}
            sx={{ width: '25ch' }}
            onChange={handleSearchChange}
          />
          {loading ? (
            <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {headCells.map(headCell => (
                      <TableCell key={headCell.id}>{headCell.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blogs.length > 0 ? (
                    blogs.map(blog => (
                      <TableRow key={blog._id}>
                        <TableCell>
                          <img
                            src={blog.thumbnail}
                            alt={blog.title}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                            }}
                          />
                        </TableCell>
                        <TableCell>{blog.title}</TableCell>
                        <TableCell>{blog.sortDesc}</TableCell>
                        <TableCell>{getStatusChip(blog.status)}</TableCell>
                        <TableCell>
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={() => handleOpenModalDel(blog._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Change Status">
                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleOpenModalChangeStt(blog._id)
                                }
                              >
                                <ToggleOnIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  navigate(`/blogs/edit/${blog._id}`)
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Detail">
                              <IconButton
                                onClick={() =>
                                  navigate(`/blogs/detail/${blog._id}`)
                                }
                              >
                                <InfoIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={headCells.length} align="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          No data available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Box>
        <ConfirmChangeStatusModal
          open={isModalOpenChangeStt}
          title="Confirm Change Status"
          description="Are you sure you want to change the status of this blog?"
          onConfirm={handleConfirmChangeStt}
          onCancel={handleCloseModalChangeStt}
        />
        <ConfirmDeleteModal
          open={isModalOpenDel}
          onConfirm={handleConfirmDel}
          onCancel={handleCloseModalDel}
        />
      </DashboardContent>
    </>
  );
};
