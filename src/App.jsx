
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Button,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
  Avatar
} from '@mui/material';
import { CloudUpload, Image as ImageIcon, School } from '@mui/icons-material';

export default function App() {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!image) return;

    try {
      // Get the certificate preview element
      const certificateElement = document.querySelector('[data-certificate-preview]');
      if (!certificateElement) {
        alert('Certificate preview not found. Please try again.');
        return;
      }

      // Use html2canvas to capture the element as-is
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(certificateElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
        logging: false,
        removeContainer: true,
        foreignObjectRendering: false,
        ignoreElements: (element) => {
          return element.classList && element.classList.contains('no-capture');
        }
      });

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'nconnect-certificate.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Error downloading certificate. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={0} sx={{ mb: 4, p: 3, bgcolor: 'transparent' }}>
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
            <School sx={{ fontSize: 40, color: 'white' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
              NConnect Certificate Generator
            </Typography>
          </Stack>
          <Typography variant="subtitle1" align="center" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
            Upload your image to generate a personalized certificate
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Left: Upload Section */}
          <Grid item xs={6}>
            <Card
              elevation={10}
              sx={{
                height: '100%',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
                    <ImageIcon sx={{ fontSize: 25 }} />
                  </Avatar>

                  <Typography variant="h6" align="center" fontWeight="bold">
                    Upload Your Photo
                  </Typography>

                  <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: '0.85rem' }}>
                    Choose a clear photo that will appear on your certificate
                  </Typography>

                  <Button
                    variant="contained"
                    component="label"
                    size="medium"
                    startIcon={<CloudUpload />}
                    sx={{
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      fontSize: '1rem',
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                      }
                    }}
                  >
                    Choose Image
                    <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                  </Button>

                  {image ? (
                    <Chip
                      label="Image uploaded successfully!"
                      color="success"
                      variant="outlined"
                      sx={{ mt: 2 }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No image selected
                    </Typography>
                  )}

                  {image && (
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'grey.50'
                      }}
                    >
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Preview:
                      </Typography>
                      <Box
                        sx={{
                          width: 300,
                          height: 300,
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '2px solid',
                          borderColor: 'primary.main'
                        }}
                      >
                        <img
                          src={image}
                          alt="Preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                    </Paper>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Certificate Display */}
          <Grid item xs={6}>
            <Card
              elevation={10}
              sx={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <School color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Certificate Preview
                    </Typography>
                  </Stack>

                  <Divider />

                  <Box
                    position="relative"
                    data-certificate-preview
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: 3,
                      bgcolor: 'white',
                      aspectRatio: '4/3',
                      minHeight: '300px'
                    }}
                  >
                    <img
                      src="/attending.jpg"
                      alt="Certificate Template"
                      style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    {image && (
                      <Box
                        position="absolute"
                        top="19%"
                        left="80%"
                        width="300px"
                        height="300px"
                        sx={{
                          border: '1px solid rgba(255,255,255,0.5)',
                          borderRadius: 1,
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <img
                          src={image}
                          alt="Uploaded Photo"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center center'
                          }}
                        />
                      </Box>
                    )}
                    {!image && (
                      <Box
                        position="absolute"
                        top="19%"
                        left="80%"
                        width="300px"
                        height="300px"
                        sx={{
                          border: '1px dashed #ccc',
                          borderRadius: 1,
                          backgroundColor: 'rgba(255,255,255,0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <Stack alignItems="center" spacing={0.5}>
                          <ImageIcon sx={{ fontSize: 28, color: '#ccc' }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                            Photo will appear here
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                  </Box>

                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={!image}
                    size="large"
                    onClick={handleDownloadCertificate}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      fontSize: '1rem'
                    }}
                  >
                    Download Certificate
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
