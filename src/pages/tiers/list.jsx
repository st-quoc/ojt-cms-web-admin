import { useState, useEffect } from 'react';
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
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CONFIG } from '../../config-global';
import { Helmet } from 'react-helmet-async';
import { DashboardContent } from '../../layouts/dashboard/main';
import { Box } from '@mui/material';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchTiers } from '../../apis/tiers';

const headCells = [
  { id: 'image', label: 'Thumbnail' },
  { id: 'name', label: 'Name' },
  { id: 'minSpent', label: 'Min Spent' },
  { id: 'maxSpent', label: 'Max Spent' },
  { id: 'description', label: 'Description' },
  { id: 'actions', label: 'Actions' },
];

export const TiersListAdmin = () => {
  const navigate = useNavigate();
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadTiers = async () => {
      setLoading(true);
      try {
        const data = await fetchTiers(page, rowsPerPage, search);
        setTiers(data.tiers);
        setTotalCount(data.pagination.total);
      } catch (error) {
        console.error('Failed to fetch tiers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTiers();
  }, [page, rowsPerPage, search]);

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

  return (
    <>
      <Helmet>
        <title>{`${CONFIG.appName} - Tiers List`}</title>
      </Helmet>
      <DashboardContent>
        <AdminPageHeader
          breadcrumbs={[
            { label: 'Admin', path: '/' },
            { label: 'Tiers', path: '/tiers' },
          ]}
          buttons={[
            {
              label: 'Add Tier',
              onClick: () => navigate('/tiers/create'),
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
                  {tiers.length > 0 ? (
                    tiers.map(tier => (
                      <TableRow key={tier._id}>
                        <TableCell>
                          <img
                            src={tier.image}
                            alt={tier.name}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                            }}
                          />
                        </TableCell>
                        <TableCell>{tier.name}</TableCell>
                        <TableCell>{tier.minSpent}</TableCell>
                        <TableCell>{tier.maxSpent}</TableCell>
                        <TableCell>{tier.description}</TableCell>
                        <TableCell>
                          <Tooltip
                            title="Edit"
                            onClick={() => navigate(`/tiers/edit/${tier._id}`)}
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
            count={totalCount}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Box>
      </DashboardContent>
    </>
  );
};
