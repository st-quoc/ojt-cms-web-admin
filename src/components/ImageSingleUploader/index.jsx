import { useState, useEffect } from 'react';
import {
  Button,
  Box,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const ImageSingleUploader = ({ initialImage = '', setImage }) => {
  const [openPreview, setOpenPreview] = useState(false);
  const [currentImage, setCurrentImage] = useState(initialImage);

  useEffect(() => {
    setCurrentImage(initialImage);
  }, [initialImage]);

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      setImage(newImage);
      setCurrentImage(newImage);
    }
  };

  const handleRemoveImage = () => {
    setImage('');
    setCurrentImage('');
  };

  const handlePreviewImage = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  useEffect(() => {
    if (!currentImage) {
      setOpenPreview(false);
    }
  }, [currentImage]);

  return (
    <Box>
      <Button variant="contained" component="label">
        Select Image
        <input
          type="file"
          id="file-input"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>

      {currentImage && (
        <Box
          sx={{
            mt: 2,
            position: 'relative',
            width: '100px',
            height: '100px',
          }}
        >
          <img
            src={currentImage}
            alt="Preview"
            style={{
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              objectFit: 'cover',
            }}
            onClick={handlePreviewImage}
          />
          <IconButton
            size="small"
            sx={{ position: 'absolute', top: 0, right: 0 }}
            onClick={handleRemoveImage}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        fullWidth
        maxWidth="md"
      >
        <Stack direction={'row'} justifyContent="space-between">
          <DialogTitle>Preview Image</DialogTitle>
          <DialogTitle>
            <Button onClick={handleClosePreview} color="primary">
              Close
            </Button>
          </DialogTitle>
        </Stack>
        <DialogContent sx={{ position: 'relative', height: '80vh' }}>
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            initialSlide={0}
            navigation
            loop
            pagination={{ clickable: true }}
            style={{ height: '100%' }}
          >
            {currentImage && (
              <SwiperSlide style={{ height: '100%' }}>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ position: 'relative', height: '100%' }}
                >
                  <img
                    src={currentImage}
                    alt="Large Preview"
                    style={{ height: '100%' }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                    }}
                    onClick={handleRemoveImage}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </SwiperSlide>
            )}
          </Swiper>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ImageSingleUploader;
