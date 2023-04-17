/*
 * Components?
 * What's that?
 */

import React, {useEffect, useState} from 'react';
import {CssBaseline, CssVarsProvider, LinearProgress, Typography} from '@mui/joy';
import {saveAs} from 'file-saver';
import {FurAffinityService, SubmissionPage} from "../services/furaffinity.service";
import Navigation from "../components/Navigation";
import theme from "../theme";
import Box from "@mui/joy/Box";
const fa = new FurAffinityService();

let fetchProgress = 0;
let processedProgress = 0;

export default function App() {
    const [fetchProgressState, setFetchProgressState] = useState<number>(0);
    const [progressState, setProgressState] = useState<number>(0);
    const [submissions, setSubmissions] = useState<SubmissionPage[]>([]);
    const [exportDone, setExportDone] = useState(false);

    useEffect(() => {
        // If location is /login, go to /
        if (window.location.pathname === '/login') {
            window.location.href = '/';
        }

        const timeout = setTimeout(() => {
            console.log('🔐 Checking if logged in...');
            fa.checkLogin().then(() => {
                console.log('🔓 Logged in');

                fa.loadAllSubmissions((item: { id: any; }) => {
                    fetchProgress++
                    console.log(`Fetched ${item.id} - ${fetchProgress}`)

                    setFetchProgressState(fetchProgress)
                })
                    .then(res => {
                        console.log(res);
                        setSubmissions(res);

                        if (res.length === 0) return setExportDone(true);

                        const submissionsToFetch = filterSkippedSubmissions(res);
                        fa.fetchSubmissionData(submissionsToFetch, (item: { id: any; }) => {
                            processedProgress++
                            console.log(`Processed ${item.id} - ${processedProgress}`)

                            setProgressState(processedProgress)
                        })
                            .then(async () => {
                                const records = submissionsToFetch.filter(r => r.data).map(r => r.data);
                                const blob = new Blob([JSON.stringify(records, null, 1)], { type: "text/plain;charset=utf-8" });
                                await saveAs(blob, `fa_export_${Date.now()}.faxp`);

                                setExportDone(true);
                            })
                            .catch(err => {
                                console.error(err)
                            })
                    })

                // Stop checking
                clearTimeout(timeout);
            }).catch(() => {
                console.log('- Not logged in');
                setFaIsOnline(false);
            });
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    function filterSkippedSubmissions(data?: any) {
        const subs: any[] = data || submissions;
        return subs.filter(s => !s.skip)
    }

    return (
        <CssVarsProvider disableTransitionOnChange theme={theme} defaultMode="system">
            <CssBaseline />
            <Box sx={{
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                background: 'var(--joy-palette-background-body)',
            }}>
                <Navigation />

                {/* LinearProgress page loader indicator */}
                {!exportDone && <LinearProgress size="sm" sx={{ maxHeight: '0rem' }} />}

                {/* Page content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 2,
                    }}
                >
                    <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
                        {!exportDone && submissions.length === 0 && `⌛ Wait (Fetched ${fetchProgressState} submissions)`}
                        {!exportDone && submissions.length > 0 && `📝 Processing ${progressState}/${fetchProgressState} submissions (This will take a long time).`}
                        {exportDone && submissions.length > 0 && `✅ Exported ${fetchProgressState} submissions`}
                        {exportDone && submissions.length === 0 && `❌ There is nothing to export. If this is incorrect, turn off SFW mode.`}
                    </Typography>
                </Box>
            </Box>
        </CssVarsProvider>
    )
}
