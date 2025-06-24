import { useState, useCallback } from 'react';
import { Typography, Box, Stack, Modal, Slider, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import html2canvas from 'html2canvas';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './utils/cropImage';

const Mobile = () => {
  const ovalFrame = { width: 230, height: 230 }; // Making it perfectly circular for mobile
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [cropZoom, setCropZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setCroppedImage(null);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    const certificateElement = document.getElementById('certificate-container');
    if (certificateElement) {
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        backgroundColor: null,
      });
      const link = document.createElement('a');     
       link.download = 'nconnect.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // Cropper callbacks
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Crop and save
  const handleCropSave = async () => {
    if (!selectedImage || !croppedAreaPixels) return;
    const croppedUrl = await getCroppedImg(selectedImage, croppedAreaPixels, ovalFrame.width, ovalFrame.height);
    setCroppedImage(croppedUrl);
    setCropModalOpen(false);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#0A0A1E',
      color: 'white',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Header */}
      <Box sx={{ 
        mb: 3,
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <Typography variant="h5" sx={{
          fontWeight: 500,
          fontSize: '1.5rem',
          mb: 1
        }}>
          Upload Your Photo
        </Typography>
        <Typography sx={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '0.875rem'
        }}>
          Start by adding your professional photo
        </Typography>
      </Box>      {/* Upload Button */}
      <Box
        sx={{
          border: '1px dashed rgba(108, 60, 233, 0.4)',
          borderRadius: '8px',
          p: 2,
          mb: 3,
          width: '85%',
          maxWidth: '500px',
          height: '140px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          marginBottom:3,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          margin: '0 auto',
          '&:hover': {
            borderColor: '#6C3CE9',
            '& .upload-icon': {
              transform: 'scale(1.05)',
              backgroundColor: 'rgba(108, 60, 233, 0.9)'
            }
          }
        }}
        component="label"
      >
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageUpload}
        />
        <Box
          className="upload-icon"
          sx={{
            width: 48,
            height: 48,
            backgroundColor: '#6C3CE9',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 24, color: 'white' }} />
        </Box>
        <Typography sx={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'white'
        }}>
          Click to upload
        </Typography>
      </Box>

      {/* Certificate Preview */}
      <Box
        id="certificate-container"
        sx={{
          width: '100%',
          maxWidth: '500px',
          mb: 3,
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          margin: '0 auto'
        }}
      >
        <img
          src="/nconnect.png"
          alt="Certificate"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
        {selectedImage && (
          <Box
            sx={{
              position: 'absolute',
              top: '12%',
              left: '64%',
              width: '29%',
              aspectRatio: '1',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#fff'
            }}
          >
            <img
              src={croppedImage || selectedImage}
              alt="Uploaded"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
        )}
      </Box>

      {/* Crop Modal */}
      <Modal open={cropModalOpen} onClose={() => setCropModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '300px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          outline: 'none',
        }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: 'black' }}>
            Crop your photo
          </Typography>
          <Box sx={{ position: 'relative', width: '100%', height: 300, bgcolor: '#222', mx: 'auto', mb: 2 }}>
            {selectedImage && (
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={cropZoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setCropZoom}
                onCropComplete={onCropComplete}
                showGrid={false}
                restrictPosition={false}
                cropShape="round"
              />
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom sx={{ color: 'black' }}>Zoom</Typography>
            <Slider
              value={cropZoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(_, value) => setCropZoom(value)}
            />
          </Box>
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => setCropModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleCropSave}>
              Crop & Save
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Download Button */}
      <Stack
        onClick={handleDownload}
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          backgroundColor: '#1A1A35',
          borderRadius: 2,
          p: 2,
          cursor: 'pointer',
          width: '90%',
          maxWidth: '500px',
          margin: '0 auto',
          '&:hover': {
            backgroundColor: '#23234A',
          }
        }}
      >
        <Box
          sx={{
            backgroundColor: '#2B2B45',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FileDownloadIcon />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Download Banner
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
            Save your professional banner
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default Mobile;
