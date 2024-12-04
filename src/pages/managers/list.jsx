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
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CONFIG } from '../../config-global';
import { Helmet } from 'react-helmet-async';
import { DashboardContent } from '../../layouts/dashboard/main';
import { Box, Chip } from '@mui/material';
import { updateManagerStatus } from '../../apis/user';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useFetchManagers from '../../hooks/apis/useFetchManagers';

const headCells = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phoneNumber', label: 'Phone Number' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Date Created' },
  { id: 'actions', label: 'Actions' },
];

export const ManagersListAdmin = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  const { managers, loading, totalItems, fetchManagers } = useFetchManagers(
    page,
    rowsPerPage,
    search,
  );

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = event => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleChangeStatusClick = (managerId, currentStatus) => {
    setSelectedManagerId(managerId);
    setSelectedStatus(currentStatus === 'active' ? 'inactive' : 'active');
    setOpenDialog(true);
  };

  const handleConfirmChangeStatus = async () => {
    try {
      await updateManagerStatus(selectedManagerId, { status: selectedStatus });
      fetchManagers();
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to update manager status:', error);
    }
  };

  const getStatusChip = status => {
    let color = 'default';
    let label = status;

    if (status === 'active') {
      color = 'success';
      label = 'Active';
    } else if (status === 'inactive') {
      color = 'error';
      label = 'Inactive';
    } else {
      color = 'default';
      label = 'Unknown';
    }

    return <Chip label={label} color={color} />;
  };

  return (
    <>
      <Helmet>
        <title>{`${CONFIG.appName} - Manager List`}</title>
      </Helmet>
      <DashboardContent>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Admin', path: '/' },
            { label: 'Managers', path: '/managers' },
          ]}
          buttons={[
            {
              label: 'Add Manager',
              onClick: () => navigate('/managers/create'),
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
                  {managers.length > 0 ? (
                    managers.map(manager => (
                      <TableRow key={manager._id}>
                        <TableCell>{manager.name}</TableCell>
                        <TableCell>{manager.email}</TableCell>
                        <TableCell>{manager.phoneNumber}</TableCell>
                        <TableCell>{getStatusChip(manager.status)}</TableCell>
                        <TableCell>
                          {new Date(manager.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title="Edit"
                            onClick={() =>
                              navigate(`/managers/edit/${manager._id}`)
                            }
                          >
                            <IconButton>
                              <EditIcon color="primary" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="View Details">
                            <IconButton>
                              <VisibilityIcon color="secondary" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Change Status">
                            <IconButton
                              onClick={() =>
                                handleChangeStatusClick(
                                  manager._id,
                                  manager.status,
                                )
                              }
                            >
                              <ToggleOnIcon color="success" />
                            </IconButton>
                          </Tooltip>
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
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Box>
      </DashboardContent>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to change the status to{' '}
            <strong>{selectedStatus}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmChangeStatus} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
