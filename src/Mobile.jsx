import { useState } from 'react';
import { Typography, Box, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import html2canvas from 'html2canvas';

const Mobile = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
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
       link.download = 'nconnect-certificate.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#0A0A1E',
      color: 'white',
      p: 2
    }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
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
          width: '90%',
          height: '140px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
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
          mb: 3,
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <img
          src="/attending.jpg"
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
              top: '16%',
              left: '69%',
              width: '22%',
              aspectRatio: '1',
              borderRadius: '4px',
              overflow: 'hidden',
              backgroundColor: '#fff'
            }}
          >
            <img
              src={selectedImage}
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
