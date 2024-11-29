import { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Paper,
  Stack,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Editor } from '../../../components/Editor';
import CloudinaryMultipleUploader from '../../../components/CloudinaryMultipleUploader';
import { ProductVariantsForm } from './ProductVariantsForm';
import { rules } from './validator';
import { API_ROOT } from '../../../constants';
import axiosClient from '../../../config/axios';
import ModalCreateSize from '../../../components/modal/size';
import ModalCreateColor from '../../../components/modal/color';
import ModalCreateCategory from '../../../components/modal/category';
import { useNavigate } from 'react-router-dom';

export const ProductForm = ({ isEdit, onSubmit, defaultValues }) => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openColorModal, setOpenColorModal] = useState(false);
  const [openSizeModal, setOpenSizeModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sizeResponse = await axiosClient.get(
          `${API_ROOT}/admin/size/list`,
        );
        setSizeOptions(sizeResponse.data.sizes);

        const colorResponse = await axiosClient.get(
          `${API_ROOT}/admin/color/list`,
        );
        setColorOptions(colorResponse.data.colors);

        const categoryResponse = await axiosClient.get(
          `${API_ROOT}/admin/category/list`,
        );
        setCategories(categoryResponse.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleAddCategory = category => {
    setCategories(prev => [...prev, category]);
  };

  const handleAddColor = newColor => {
    setColorOptions(prev => [...prev, newColor]);
  };

  const handleAddSize = newSize => {
    setSizeOptions(prev => [...prev, newSize]);
  };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        m: '0 auto',
      }}
    >
      <ModalCreateColor
        open={openColorModal}
        onClose={() => setOpenColorModal(false)}
        onCreate={handleAddColor}
      />
      <ModalCreateSize
        open={openSizeModal}
        onClose={() => setOpenSizeModal(false)}
        onCreate={handleAddSize}
      />
      <ModalCreateCategory
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
        onCreate={handleAddCategory}
      />
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}
      >
        <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
          <Stack spacing={2}>
            <Typography variant="body1">
              <strong>Information:</strong>
            </Typography>
            <Controller
              name="name"
              control={control}
              rules={rules.name}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Tên sản phẩm"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ w: 'fit-content' }}
                  onClick={() => setOpenCategoryModal(true)}
                >
                  New Category
                </Button>
              </Box>
              <FormControl fullWidth>
                <InputLabel>Categories</InputLabel>
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      multiple
                      value={field.value || []}
                      input={<OutlinedInput label="Categories" />}
                      fullWidth
                      onChange={e => field.onChange(e.target.value)}
                    >
                      {categories.map(cate => (
                        <MenuItem key={cate._id} value={cate._id}>
                          {cate.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.categories && (
                  <Typography color="error" variant="caption">
                    {errors.categories?.message}
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </Stack>
        </Paper>

        <ProductVariantsForm
          variants={defaultValues.variants}
          rules={rules.variants}
          control={control}
          errors={errors}
          colorOptions={colorOptions}
          sizeOptions={sizeOptions}
          openColorModal={openColorModal}
          openSizeModal={openSizeModal}
          onCreateNewColor={() => setOpenColorModal(true)}
          onCreateNewSize={() => setOpenSizeModal(true)}
        />

        <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
          <FormControl fullWidth>
            <Stack spacing={2}>
              <Typography variant="body1">
                <strong>Images:</strong>
              </Typography>
              <Controller
                name="images"
                control={control}
                rules={rules.images}
                defaultValue={[]}
                render={({ field }) => (
                  <CloudinaryMultipleUploader
                    images={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.images && (
                <Typography color="error" variant="caption">
                  {errors.images?.message}
                </Typography>
              )}
            </Stack>
          </FormControl>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
          <Stack spacing={2}>
            <Typography variant="body1">
              <strong>Short Description:</strong>
            </Typography>
            <Controller
              name="sortDesc"
              control={control}
              rules={rules.sortDesc}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Short Description"
                  multiline
                  error={!!errors.sortDesc}
                  helperText={errors.sortDesc?.message}
                />
              )}
            />
            <Typography variant="body1">
              <strong>Full Description:</strong>
            </Typography>
            <Controller
              name="fullDesc"
              control={control}
              rules={rules.fullDesc}
              render={({ field }) => (
                <Editor
                  initialData={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.fullDesc && (
              <Typography color="error" variant="caption">
                {errors.fullDesc?.message}
              </Typography>
            )}
          </Stack>
        </Paper>

        <Stack spacing={2} direction="row">
          <Box>
            <Button type="submit" variant="contained" color="primary">
              {isEdit ? 'Save' : 'Create'}
            </Button>
          </Box>
          <Box>
            <Button
              variant="outlined"
              onClick={() => navigate(`/admin/product/detail/${defaultValues.id}`)}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};
