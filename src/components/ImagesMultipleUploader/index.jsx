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

const ImagesMultipleUploader = ({ initialImages = [], setImages }) => {
  const [openPreview, setOpenPreview] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setLocalImages] = useState(initialImages);

  useEffect(() => {
    setLocalImages(initialImages);
  }, [initialImages]);

  const handleFileChange = event => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newImages]);
    setLocalImages(prevImages => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = imageToRemove => {
    setImages(prevImages =>
      prevImages.filter(image => image !== imageToRemove),
    );
    setLocalImages(prevImages => prevImages.filter(image => image !== imageToRemove));

    if (images.length === 1) {
      setOpenPreview(false);
    }
  };

  const handlePreviewImage = index => {
    setCurrentImageIndex(index);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  return (
    <Box>
      <Button variant="contained" component="label">
        Select Images
        <input
          type="file"
          id="file-input"
          hidden
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </Button>

      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {images.map((image, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <img
              src={image}
              alt={`Preview ${index}`}
              style={{
                maxWidth: '100px',
                maxHeight: '100px',
                cursor: 'pointer',
              }}
              onClick={() => handlePreviewImage(index)}
            />
            <IconButton
              size="small"
              sx={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => handleRemoveImage(image)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        fullWidth
        maxWidth="md"
      >
        <Stack direction={'row'} justifyContent="space-between">
          <DialogTitle>Preview Images</DialogTitle>
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
            initialSlide={currentImageIndex}
            navigation
            loop
            pagination={{ clickable: true }}
            style={{ height: '100%' }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} style={{ height: '100%' }}>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ position: 'relative', height: '100%' }}
                >
                  <img
                    src={image}
                    alt={`Large Preview ${index}`}
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
                    onClick={() => handleRemoveImage(image)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </SwiperSlide>
            ))}
          </Swiper>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ImagesMultipleUploader;
