import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { CloudinaryContext } from 'cloudinary-react';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const CloudinaryMultipleUploader = ({ images = [], onChange }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = async (e) => {
    setLoading(true);
    const { files } = e.target;

    try {
      const uploadedImages = await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append(
            'upload_preset',
            import.meta.env.VITE_CLOUDINARY_PRESET
          );

          const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          return data.secure_url;
        })
      );

      onChange([...images, ...uploadedImages]);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image!');
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onChange(updatedImages);
  };

  const handleImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <Box>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          onChange={handleImageUpload}
          multiple
          ref={fileInputRef}
          onClick={resetFileInput}
        />
      </Button>

      {loading && <p>Loading...</p>}

      {previewImage && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={previewImage}
              alt="Preview"
              sx={{ maxWidth: '90%', maxHeight: '80vh', borderRadius: 2 }}
            />
            <IconButton
              onClick={handleClosePreview}
              sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}
            >
              X
            </IconButton>
          </Box>
        </Box>
      )}

      {0 < images?.length && (
        <CloudinaryContext
          style={{ display: 'flex', maxWidth: '100%', gap: 15, marginTop: 15 }}
        >
          {images.map((imageUrl, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                width: 150,
                height: 150,
                borderRadius: 2,
                overflow: 'hidden',
                '&:hover .action-buttons': {
                  opacity: 1,
                },
              }}
            >
              <Box
                component="img"
                alt=""
                src={imageUrl}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                className="action-buttons"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  display: 'flex',
                  gap: 1,
                  opacity: 0,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              >
                <Tooltip title="Preview">
                  <IconButton
                    onClick={() => handleImagePreview(imageUrl)}
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => handleImageDelete(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </CloudinaryContext>
      )}
    </Box>
  );
};

export default CloudinaryMultipleUploader;
