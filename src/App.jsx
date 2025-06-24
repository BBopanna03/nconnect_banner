import { useState, useRef, useEffect, useCallback } from 'react';
import { Grid, Typography, Box, IconButton, Stack, Modal, Slider, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import html2canvas from 'html2canvas';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './utils/cropImage';

const ovalFrame = { width: 170, height: 210 }; // Match your template oval

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [cropZoom, setCropZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  const certificateRef = useRef(null);
  const containerRef = useRef(null);

  // Mouse drag for certificate zoom/pan
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX - position.x;
      const startY = e.clientY - position.y;
      setIsDragging(true);
      setDragStart({ x: startX, y: startY });
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      e.preventDefault();
      e.stopPropagation();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      requestAnimationFrame(() => {
        setPosition({ x: newX, y: newY });
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  };

  useEffect(() => {
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  // Image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setCroppedImage(null);
        setCropModalOpen(true); // Open crop modal after upload
      };
      reader.readAsDataURL(file);
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

  const downloadCertificate = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current, {
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
      width: '100%',
      margin: '0 auto',
      height: '100vh',
      backgroundColor: '#0A0A1E',
      color: 'white',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Box sx={{ position: 'relative', zIndex: 1,display: 'flex', justifyContent:'center',alignItems:'center' }}>
        <Grid container columns={12} sx={{ height: '100vh', margin: '0 auto' }}>
          {/* Left Column */}
          <Grid sx={{
            gridColumn: { xs: 'span 12', md: 'span 6' },
            height: '100%',
            overflowY: 'auto',
            p: 4,
            borderRight: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Box sx={{
              mb: 6,
              mt: 2,
              width: '100%',
              maxWidth: '450px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Typography variant="h4" sx={{
                mb: 1,
                fontWeight: 500,
                fontSize: '2rem',
                textAlign: 'center'
              }}>
                Upload Your Photo
              </Typography>
              <Typography variant="body1" sx={{
                color: 'rgba(255,255,255,0.7)',
                mb: 4,
                fontSize: '1rem',
                textAlign: 'center'
              }}>
                Start by adding your professional photo
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  border: '1px dashed rgba(108, 60, 233, 0.4)',
                  borderRadius: '8px',
                  p: 3,
                  width: '280px',
                  height: '180px',
                  mx: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
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
                    width: 64,
                    height: 64,
                    backgroundColor: '#6C3CE9',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Typography sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'white',
                  textAlign: 'center'
                }}>
                  Click to upload
                </Typography>
              </Box>
            </Box>

            <Box sx={{
              mt: 8,
              width: '100%',
              maxWidth: '450px'
            }}>
              <Typography variant="h5" sx={{
                mb: 4,
                fontSize: '1.5rem',
                fontWeight: 500,
                textAlign: 'center'
              }}>
                Next Steps
              </Typography>

              <Box
                sx={{
                  backgroundColor: '#1A1A35',
                  borderRadius: 2,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  width: '100%',
                  '&:hover': {
                    backgroundColor: '#23234A',
                  }
                }}
                onClick={downloadCertificate}
              >
                <Box
                  sx={{
                    backgroundColor: '#2B2B45',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <FileDownloadIcon />
                </Box>
                <Box textAlign="center">
                  <Typography variant="subtitle1">Download Banner</Typography>
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    Save your professional banner
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Certificate Preview */}
          <Grid sx={{
            gridColumn: { xs: 'span 12', md: 'span 6' },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            p: 4,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Zoom Controls */}
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
              <IconButton onClick={handleZoomOut} sx={{ color: 'white' }}>
                <ZoomOutIcon />
              </IconButton>
              <Typography sx={{ color: 'white', minWidth: '60px', textAlign: 'center' }}>
                {Math.round(zoom * 100)}%
              </Typography>
              <IconButton onClick={handleZoomIn} sx={{ color: 'white' }}>
                <ZoomInIcon />
              </IconButton>
            </Stack>

            {/* Certificate Container */}
            <Box
              ref={containerRef}
              onMouseDown={handleMouseDown}
              sx={{
                width: '100%',
                height: 'calc(100vh - 120px)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                maxWidth: '90%',
                userSelect: 'none'
              }}
            >
              <Box
                ref={certificateRef}
                sx={{
                  position: 'relative',
                  transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-in-out',
                  cursor: zoom > 1 ? 'grab' : 'default',
                  '&:active': {
                    cursor: 'grabbing'
                  },
                  width: 'fit-content',
                  height: 'fit-content',
                  '& img.background': {
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: 'calc(100vh - 120px)',
                    display: 'block',
                    objectFit: 'contain'
                  },
                  '& .photo-overlay': {
                    position: 'absolute',
                    top: '30px',
                    left: '340px',
                    width: `${ovalFrame.width}px`,
                    height: `${ovalFrame.height}px`,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                }}
              >
                <img
                  src="/nconnect.png"
                  alt="Certificate"
                  className="background"
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                />
                {croppedImage && (
                  <div className="photo-overlay">
                    <img
                      src={croppedImage}
                      alt="Uploaded"
                      draggable="false"
                      onDragStart={(e) => e.preventDefault()}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                    />
                  </div>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Modal open={cropModalOpen} onClose={() => setCropModalOpen(false)}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: ovalFrame.width + 40,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            outline: 'none',
          }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Crop your photo
            </Typography>
            <Box sx={{ position: 'relative', width: ovalFrame.width, height: ovalFrame.height, bgcolor: '#222', mx: 'auto', textAlign: 'center' }}>
              {selectedImage && (
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={cropZoom}
                  aspect={ovalFrame.width / ovalFrame.height}
                  cropSize={ovalFrame}
                  onCropChange={setCrop}
                  onZoomChange={setCropZoom}
                  onCropComplete={onCropComplete}
                  showGrid={false}
                  restrictPosition={false}
                />
              )}
              {/* Oval outline overlay */}
              <Box
                sx={{
                  pointerEvents: 'none',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: ovalFrame.width,
                  height: ovalFrame.height,
                  borderRadius: '50%',
                  border: '3px solid #fff',
                  boxSizing: 'border-box',
                  zIndex: 10,
                  mx: 'auto'
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>Zoom</Typography>
              <Slider
                value={cropZoom}
                min={1}
                max={3}
                step={0.01}
                onChange={(_, value) => setCropZoom(value)}
              />
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button variant="outlined" color="secondary" onClick={() => setCropModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleCropSave}>
                Crop & Save
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default App;