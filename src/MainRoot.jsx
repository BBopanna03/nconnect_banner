import { useEffect, useState } from "react";
import './index.css';
import Mobile from "./Mobile";
import App from "./App";
import { Dialog, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function Root() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showWelcome, setShowWelcome] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {isMobile ? <Mobile /> : <App />}            
            
            <Dialog
                fullScreen
                open={showWelcome}
                onClose={() => setShowWelcome(false)}
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: 'rgba(10, 10, 30, 0.95)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                }}
            >                <Box sx={{
                textAlign: 'center',
                p: 6,
                maxWidth: '90%',
                backgroundColor: 'rgba(10, 10, 30, 0.7)',
                borderRadius: 4,
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(108, 60, 233, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4
            }}>
                    <Box>
                        <Typography variant="h3" sx={{
                            color: 'white',
                            fontWeight: 600,
                            mb: 3,
                            fontSize: { xs: '2rem', sm: '3rem' }
                        }}>
                            🎉 Welcome to NammaQA Nconnect!
                        </Typography>
                        <Typography variant="h5" sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 500,
                            fontSize: { xs: '1.1rem', sm: '1.3rem' },
                            lineHeight: 1.5,
                            maxWidth: '800px',
                            mx: 'auto'
                        }}>
                            Thank you for being part of this amazing event! Let's celebrate your participation by creating your personalized certificate of attendance.
                        </Typography>
                    </Box>
                    <Box
                        onClick={() => setShowWelcome(false)}
                        sx={{
                            backgroundColor: '#6C3CE9',
                            color: 'white',
                            py: 2,
                            px: 4,
                            borderRadius: 2,
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                backgroundColor: '#8B66FF',
                                transform: 'scale(1.05)'
                            }
                        }}
                    >
                        Get Started
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};