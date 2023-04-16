import * as React from 'react';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import {Typography} from "@mui/joy";

import ImportExportIcon from '@mui/icons-material/ImportExport';

export default function Navigation() {
    return (
        <Box
            component="header"
            className="Header"
            sx={[
                {
                    p: 2,
                    gap: 2,
                    bgcolor: 'background.surface',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gridColumn: '1 / -1',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1100,
                },
            ]}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                <IconButton
                    size="sm"
                    variant="solid"
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                    <ImportExportIcon />
                </IconButton>
                <Typography component="h1" fontWeight="xl">
                    Yipnyap Import
                </Typography>
            </Box>
        </Box>
    );
}
