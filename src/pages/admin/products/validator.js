export const rules = {
  name: {
    required: 'Product name is required',
    minLength: {
      value: 3,
      message: 'Product name must be at least 3 characters',
    },
    maxLength: {
      value: 100,
      message: 'Product name cannot exceed 100 characters',
    },
    pattern: {
      value: /^[A-Za-z0-9\s]+$/,
      message: 'Product name can only contain letters, numbers, and spaces',
    },
  },
  images: {
    required: 'At least one image is required',
    validate: value => value.length > 0 || 'You must upload at least one image',
  },
  sortDesc: {
    required: 'Short description is required',
    maxLength: {
      value: 300,
      message: 'Short description cannot exceed 300 characters',
    },
  },
  fullDesc: {
    required: 'Full description is required',
    maxLength: {
      value: 5000,
      message: 'Full description cannot exceed 5000 characters',
    },
  },
  variants: {
    color: {
      required: 'Color is required',
    },
    size: {
      required: 'Size is required',
    },
    stock: {
      required: 'Stock is required',
      min: {
        value: 0,
        message: 'Stock cannot be less than 0',
      },
      pattern: {
        value: /^[0-9]*$/,
        message: 'Stock must be a valid number',
      },
    },
    price: {
      required: 'Price is required',
      min: {
        value: 0,
        message: 'Price must be greater than 0',
      },
    },
  },
};
