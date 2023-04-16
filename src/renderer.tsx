import React from 'react';
import ReactDOM from 'react-dom/client';
import jquery from 'jquery';

import { StyledEngineProvider } from '@mui/joy/styles';
import App from "./pages/App";

if (!jquery('.navhideonmobile').html().toLowerCase().includes('log in')) {
    jquery('.navhideonmobile').css('display', 'none');

    // create a #root element
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    root.setAttribute('style', 'z-index: 999999; position: fixed; top: 0; left: 0; height: 100%; width: 100%;');
    document.body.appendChild(root);

    ReactDOM.createRoot(document.querySelector("#root")).render(
        <React.StrictMode>
            <StyledEngineProvider injectFirst>
                <App />
            </StyledEngineProvider>
        </React.StrictMode>
    );
}
