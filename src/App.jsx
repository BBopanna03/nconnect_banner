import { useState, useRef, useEffect, useCallback } from 'react';
import { Grid, Typography, Box, IconButton, Stack, Modal, Slider, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import html2canvas from 'html2canvas';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './utils/cropImage';

//const circleFrame = { width: 170, height: 170 }; // Use square dimensions for perfect circle

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
    const croppedUrl = await getCroppedImg(selectedImage, croppedAreaPixels, OVERLAY_SIZE, OVERLAY_SIZE);
    setCroppedImage(croppedUrl);
    setCropModalOpen(false);
  };
  // Adjust these values to fine-tune the overlay position in the download
  const OVERLAY_TOP_PERCENT = 12;  // Matches preview position
  const OVERLAY_LEFT_PERCENT = 61; // Matches preview position
  const OVERLAY_SIZE = 380;        // Size for both width and height to maintain circle

  const downloadCertificate = async () => {
    // Create a temporary div for rendering
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '1300px';
    tempDiv.style.height = '1300px';
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    // Create and load the background image
    const bgImg = document.createElement('img');
    bgImg.src = '/nconnect.png';
    bgImg.style.width = '100%';
    bgImg.style.height = '100%';
    bgImg.style.objectFit = 'contain';
    tempDiv.appendChild(bgImg);

    if (croppedImage) {
      // Create the overlay container
      const overlayDiv = document.createElement('div');
      overlayDiv.style.position = 'absolute';
      overlayDiv.style.top = `${OVERLAY_TOP_PERCENT}%`;
      overlayDiv.style.left = `${OVERLAY_LEFT_PERCENT}%`;
      overlayDiv.style.width = `${OVERLAY_SIZE}px`;
      overlayDiv.style.height = `${OVERLAY_SIZE}px`;
      // overlayDiv.style.transform = 'translateX(-50%)';
      // overlayDiv.style.borderRadius = '50%';
      overlayDiv.style.overflow = 'hidden';
      overlayDiv.style.backgroundColor = 'transparent';

      // Create and add the overlay image
      const overlayImg = document.createElement('img');
      overlayImg.src = croppedImage;
      overlayImg.style.width = '100%';
      overlayImg.style.height = '100%';
      overlayImg.style.objectFit = 'cover';
      overlayImg.style.borderRadius = '50%';
      overlayDiv.appendChild(overlayImg);
      tempDiv.appendChild(overlayDiv);
    }

    // Wait for images to load
    await Promise.all([
      new Promise(resolve => bgImg.onload = resolve),
      croppedImage ? new Promise(resolve => {
        const img = tempDiv.querySelector('img:last-child');
        if (img.complete) resolve();
        else img.onload = resolve;
      }) : Promise.resolve()
    ]);

    // Capture the image
    const canvas = await html2canvas(tempDiv, {
      width: 1300,
      height: 1300,
      scale: 1,
      backgroundColor: null,
    });

    // Create download link
    const link = document.createElement('a');
    link.download = 'nconnect-certificate.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Clean up
    document.body.removeChild(tempDiv);
  };

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#0A0A1E',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',  // Center horizontally
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1300px', // Set max-width
        margin: '0 auto',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Grid container columns={12} sx={{
          height: '100%',
          margin: '0 auto',
          width: '100%'
        }}>
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
                height: '100%', // Changed from calc
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                maxWidth: '1300px',
                margin: '0 auto',
                userSelect: 'none',
                padding: '20px' // Added padding
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
                  width: '100%',
                  height: '100%', // Changed from auto
                  maxWidth: '1300px',
                  display: 'flex', // Added
                  alignItems: 'center', // Added
                  justifyContent: 'center', // Added
                  '& img.background': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    maxWidth: '1300px', // Added max-width
                    maxHeight: '1300px' // Added max-height
                  },
                  '& .photo-overlay': {
                    position: 'absolute',
                    top: '11%',
                    left: '72%',
                    width: '170px', // Fixed width
                    height: '170px', // Fixed height
                    transform: 'translateX(-50%)',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
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
                  style={{ maxWidth: '100%', maxHeight: '100%' }} // Added style
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
            width: OVERLAY_SIZE + 40,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            outline: 'none',
          }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Crop your photo
            </Typography>
            <Box sx={{ position: 'relative', width: OVERLAY_SIZE, height: OVERLAY_SIZE, bgcolor: '#222', mx: 'auto', textAlign: 'center' }}>
              {selectedImage && (
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={cropZoom} aspect={1}
                  cropSize={{ width: OVERLAY_SIZE, height: OVERLAY_SIZE }}
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
                  left: 0, width: OVERLAY_SIZE,
                  height: OVERLAY_SIZE,
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