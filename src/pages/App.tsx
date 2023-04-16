/*
 * Components?
 * What's that?
 */

import React, {useEffect, useState} from 'react';
import {CssBaseline, CssVarsProvider, LinearProgress, Typography} from '@mui/joy';
import {FurAffinityService} from "../services/furaffinity.service";
import Navigation from "../components/Navigation";
import theme from "../theme";
import Box from "@mui/joy/Box";
const fa = new FurAffinityService();

export default function App() {
    const [faIsOnline, setFaIsOnline] = useState(false);

    useEffect(() => {
        // If location is /login, go to /
        if (window.location.pathname === '/login') {
            window.location.href = '/';
        }

        const timeout = setTimeout(() => {
            fa.checkLogin().then(() => {
                setFaIsOnline(true);

                // Stop checking
                clearTimeout(timeout);
            }).catch(() => {
                setFaIsOnline(false);
            });
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <CssVarsProvider disableTransitionOnChange theme={theme}>
            <CssBaseline />
            <Box sx={{
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                background: 'var(--joy-palette-background-body)',
                opacity: '0.97',
            }}>
                <Navigation />

                {/* LinearProgress page loader indicator */}
                <LinearProgress size="sm" sx={{ maxHeight: '0rem' }} />

                {/* Page content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 2,
                    }}
                >
                    <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
                        Tool is communicating... ({faIsOnline ? 'Online' : 'Offline'})
                    </Typography>
                </Box>
            </Box>
        </CssVarsProvider>
    )
}
