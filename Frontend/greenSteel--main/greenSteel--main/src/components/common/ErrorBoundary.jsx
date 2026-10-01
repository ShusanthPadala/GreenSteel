import { Component } from 'react';
import { Box, Button, Card, Typography } from '@mui/material';

/**
 * Catches unexpected errors in a page so one broken widget never blanks the
 * whole app. Shows a friendly card with a reload button instead.
 */
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error('GreenSteel page error:', error, info?.componentStack);
    }

    componentDidUpdate(prevProps) {
        // Navigating to another page clears the error
        if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
            this.setState({ error: null });
        }
    }

    render() {
        if (!this.state.error) return this.props.children;
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '50vh', p: 2 }}>
                <Card sx={{ p: 4, maxWidth: 460, textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ mb: 1 }}>Something went wrong on this page</Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                        Your data is safe. Reload the page to try again; if it keeps happening, please contact your administrator.
                    </Typography>
                    <Button variant="contained" onClick={() => window.location.reload()}>Reload page</Button>
                </Card>
            </Box>
        );
    }
}
