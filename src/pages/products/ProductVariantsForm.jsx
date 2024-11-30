import { useState } from 'react';
import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  IconButton,
  OutlinedInput,
} from '@mui/material';
import { AddCircle, Delete } from '@mui/icons-material';
import { Controller } from 'react-hook-form';

export const ProductVariantsForm = ({
  variants: defaultValue,
  rules,
  control,
  errors,
  colorOptions = [],
  sizeOptions = [],
  onCreateNewColor,
  onCreateNewSize,
}) => {
  const [variants, setVariants] = useState(
    defaultValue ?? [{ size: '', color: '', stock: '', price: '' }],
  );

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: '', color: '', stock: '', price: '' }]);
  };

  const handleRemoveVariant = index => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  return (
    <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" fontWeight="bold">
            Variants:
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" size="small" onClick={onCreateNewColor}>
              New Color
            </Button>
            <Button variant="outlined" size="small" onClick={onCreateNewSize}>
              New Size
            </Button>
          </Stack>
        </Stack>

        {variants.map((variant, index) => (
          <Stack direction="row" spacing={2} key={index}>
            <FormControl fullWidth error={!!errors?.variants?.[index]?.color}>
              <InputLabel>Color</InputLabel>
              <Controller
                name={`variants[${index}].color`}
                control={control}
                rules={rules.color}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={variant.color ? variant.color._id : ''}
                    input={<OutlinedInput label="Color" />}
                    onChange={e => {
                      const selectedColor = colorOptions.find(
                        color => color._id === e.target.value,
                      );
                      handleVariantChange(index, 'color', selectedColor);
                      field.onChange(selectedColor._id);
                    }}
                  >
                    {colorOptions?.map((color, i) => (
                      <MenuItem key={i} value={color._id}>
                        {color.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors?.variants?.[index]?.color && (
                <Typography variant="caption" color="error">
                  {errors.variants[index].color.message}
                </Typography>
              )}
            </FormControl>

            <Controller
              name={`variants[${index}].size`}
              control={control}
              rules={rules.size}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors?.variants?.[index]?.size}
                >
                  <InputLabel>Size</InputLabel>
                  <Select
                    {...field}
                    value={variant.size ? variant.size._id : ''}
                    input={<OutlinedInput label="Size" />}
                    onChange={e => {
                      const selectedSize = sizeOptions.find(
                        s => s._id === e.target.value,
                      );
                      handleVariantChange(index, 'size', selectedSize);
                      field.onChange(selectedSize._id);
                    }}
                  >
                    {sizeOptions?.map((size, i) => (
                      <MenuItem key={i} value={size._id}>
                        {size.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors?.variants?.[index]?.size && (
                    <Typography variant="caption" color="error">
                      {errors.variants[index].size.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name={`variants[${index}].stock`}
              control={control}
              rules={rules.stock}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Stock"
                  fullWidth
                  error={!!errors?.variants?.[index]?.stock}
                  helperText={errors?.variants?.[index]?.stock?.message}
                />
              )}
            />

            <Controller
              name={`variants[${index}].price`}
              control={control}
              rules={rules.price}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Price"
                  fullWidth
                  error={!!errors?.variants?.[index]?.price}
                  helperText={errors?.variants?.[index]?.price?.message}
                />
              )}
            />

            {variants.length > 1 && (
              <IconButton
                color="error"
                onClick={() => handleRemoveVariant(index)}
              >
                <Delete />
              </IconButton>
            )}
          </Stack>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddCircle />}
          onClick={handleAddVariant}
        >
          Add Variant
        </Button>
      </Stack>
    </Paper>
  );
};
