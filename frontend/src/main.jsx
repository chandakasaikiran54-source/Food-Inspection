/**
 * src/main.jsx
 * React application entry point.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 20, color: 'red', fontFamily: 'monospace' }}>
                    <h2>React Caught an Error</h2>
                    <pre>{this.state.error?.toString()}</pre>
                    <pre>{this.state.error?.stack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

// Also wire global errors just in case Vite or other non-React things crash
window.onerror = function (msg, url, lineNo, columnNo, error) {
    const div = document.createElement('div');
    div.style.padding = '20px';
    div.style.color = 'red';
    div.style.fontFamily = 'monospace';
    div.innerText = 'Global Error: ' + msg + '\n' + (error ? error.stack : '');
    document.body.prepend(div);
    return false;
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </StrictMode>
);
