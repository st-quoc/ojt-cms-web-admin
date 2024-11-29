import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import axiosClient from '../../../config/axios';
import { API_ROOT } from '../../../constants';

export const ProductsFilter = ({ filters, setFilters }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempFilters, setTempFilters] = useState(filters);

  const handleClickFiltersButton = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const applyFilters = () => {
    const updatedFilters = {
      ...tempFilters,
      stockCondition: tempFilters.stockCondition || '>',
      stockValue: tempFilters.stockValue || '',
    };
    setFilters(updatedFilters);
    handleClose();
  };

  const removeFilter = key => {
    let updatedFilters;

    if (Array.isArray(tempFilters[key])) {
      updatedFilters = {
        ...tempFilters,
        [key]: [],
      };
    } else {
      updatedFilters = {
        ...tempFilters,
        [key]: '',
      };
    }
    if (key === 'stock') {
      updatedFilters.stockCondition = '>';
      updatedFilters.stockValue = '';
    }

    setTempFilters(updatedFilters);
    setFilters(updatedFilters);
  };

  const open = Boolean(anchorEl);

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sizeResponse = await axiosClient.get(
          `${API_ROOT}/admin/size/list`,
        );
        setSizes(sizeResponse.data.sizes);

        const colorResponse = await axiosClient.get(
          `${API_ROOT}/admin/color/list`,
        );
        setColors(colorResponse.data.colors);

        const categoryResponse = await axiosClient.get(
          `${API_ROOT}/admin/category/list`,
        );
        setCategories(categoryResponse.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderChips = () => {
    const chips = [];

    if (filters.search) {
      chips.push(
        <Chip
          key="search"
          label={`Search: ${filters.search}`}
          onDelete={() => removeFilter('search')}
        />,
      );
    }

    if (filters.category.length > 0) {
      chips.push(
        ...filters.category.map(categoryId => {
          const category = categories.find(cat => cat._id === categoryId);
          return (
            <Chip
              key={`category-${categoryId}`}
              label={`Category: ${category?.name}`}
              onDelete={() => {
                const updatedCategory = tempFilters.category.filter(
                  id => id !== categoryId,
                );
                const updatedFilters = {
                  ...tempFilters,
                  category: updatedCategory,
                };
                setTempFilters(updatedFilters);
                setFilters(updatedFilters);
              }}
            />
          );
        }),
      );
    }

    if (filters.color.length > 0) {
      chips.push(
        ...filters.color.map(colorId => {
          const color = colors.find(col => col._id === colorId);
          return (
            <Chip
              key={`color-${colorId}`}
              label={`Color: ${color?.name}`}
              onDelete={() => {
                const updatedColor = tempFilters.color.filter(
                  id => id !== colorId,
                );
                const updatedFilters = { ...tempFilters, color: updatedColor };
                setTempFilters(updatedFilters);
                setFilters(updatedFilters);
              }}
            />
          );
        }),
      );
    }

    if (filters.size.length > 0) {
      chips.push(
        ...filters.size.map(sizeId => {
          const size = sizes.find(sz => sz._id === sizeId);
          return (
            <Chip
              key={`size-${sizeId}`}
              label={`Size: ${size?.name}`}
              onDelete={() => {
                const updatedSize = tempFilters.size.filter(
                  id => id !== sizeId,
                );
                const updatedFilters = { ...tempFilters, size: updatedSize };
                setTempFilters(updatedFilters);
                setFilters(updatedFilters);
              }}
            />
          );
        }),
      );
    }

    if (
      (filters.priceMin && filters.priceMin > 0) ||
      (filters.priceMax && filters.priceMax < 999999999)
    ) {
      chips.push(
        <Chip
          key="price"
          label={`Price: ${filters.priceMin || 0} - ${filters.priceMax || '∞'}`}
          onDelete={() => {
            const updatedFilters = {
              ...tempFilters,
              priceMin: '',
              priceMax: '',
            };
            setTempFilters(updatedFilters);
            setFilters(updatedFilters);
          }}
        />,
      );
    }

    if (filters.stockValue && filters.stockCondition) {
      chips.push(
        <Chip
          key="stock"
          label={`Stock: ${filters.stockCondition} ${filters.stockValue}`}
          onDelete={() => {
            const updatedFilters = {
              ...tempFilters,
              stockCondition: '>',
              stockValue: '',
            };
            setTempFilters(updatedFilters);
            setFilters(updatedFilters);
          }}
        />,
      );
    }

    return chips;
  };

  const defaultFilters = {
    search: '',
    category: [],
    priceMin: 0,
    priceMax: 999999999,
    color: [],
    size: [],
    stockCondition: '>',
    stockValue: 0,
  };

  const resetFilters = () => {
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  const handleSearchChange = event => {
    setFilters({
      ...filters,
      search: event.target.value,
    });
    setPage(0);
  };

  const clearSearch = () => {
    setFilters({
      ...filters,
      search: '',
    });
    setPage(0);
  };

  return (
    <>
      <Stack spacing={2} direction={'column'}>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {renderChips()}
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ m: 0, w: '100%' }}
        >
          <FormControl sx={{ m: 0, width: '25ch' }} variant="outlined">
            <InputLabel size="small">Search product...</InputLabel>
            <OutlinedInput
              size="small"
              type="text"
              label="Search product..."
              value={filters.search}
              onChange={handleSearchChange}
              endAdornment={
                filters.search && (
                  <InputAdornment position="end" onClick={clearSearch}>
                    <ClearIcon />
                  </InputAdornment>
                )
              }
            />
          </FormControl>

          <Button
            variant="contained"
            onClick={handleClickFiltersButton}
            size="small"
          >
            Filters
          </Button>
        </Stack>
      </Stack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 4, width: 300 }}>
          <FormControl fullWidth size="small" margin="normal">
            <InputLabel>Categories</InputLabel>
            <Select
              value={tempFilters.category}
              onChange={e =>
                setTempFilters({ ...tempFilters, category: e.target.value })
              }
              input={<OutlinedInput label="Categories" />}
              multiple
            >
              {categories.map((category, index) => (
                <MenuItem key={index} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Min Price"
              type="number"
              size="small"
              value={tempFilters.priceMin}
              onChange={e =>
                setTempFilters({ ...tempFilters, priceMin: e.target.value })
              }
            />
            <TextField
              label="Max Price"
              type="number"
              size="small"
              value={tempFilters.priceMax}
              onChange={e =>
                setTempFilters({ ...tempFilters, priceMax: e.target.value })
              }
            />
          </Stack>

          <FormControl fullWidth size="small" margin="normal">
            <InputLabel>Colors</InputLabel>
            <Select
              value={tempFilters.color}
              onChange={e =>
                setTempFilters({ ...tempFilters, color: e.target.value })
              }
              input={<OutlinedInput label="Colors" />}
              multiple
            >
              {colors.map((color, index) => (
                <MenuItem key={index} value={color._id}>
                  {color.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" margin="normal">
            <InputLabel>Sizes</InputLabel>
            <Select
              value={tempFilters.size}
              onChange={e =>
                setTempFilters({ ...tempFilters, size: e.target.value })
              }
              input={<OutlinedInput label="Sizes" />}
              multiple
            >
              {sizes.map((size, index) => (
                <MenuItem key={index} value={size._id}>
                  {size.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2}>
            <FormControl size="small">
              <Select
                value={tempFilters.stockCondition}
                onChange={e =>
                  setTempFilters({
                    ...tempFilters,
                    stockCondition: e.target.value,
                  })
                }
              >
                <MenuItem value=">">{'>'}</MenuItem>
                <MenuItem value="<">{'<'}</MenuItem>
                <MenuItem value="=">{'='}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Stock"
              type="number"
              size="small"
              value={tempFilters.stockValue}
              onChange={e =>
                setTempFilters({
                  ...tempFilters,
                  stockValue: e.target.value,
                })
              }
            />
          </Stack>

          <Stack direction="row" spacing={2} mt={2}>
            <Button variant="outlined" onClick={resetFilters}>
              Clear
            </Button>
            <Button variant="contained" onClick={applyFilters}>
              Apply
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  );
};
