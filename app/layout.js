import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/lib/authContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'DashPulse Analytics — Pro',
  description: 'Premium real-time analytics dashboard for modern businesses.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#0D1220',
                  color: '#E8EFF8',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                },
                success: { iconTheme: { primary: '#00E5A0', secondary: '#0D1220' } },
                error: { iconTheme: { primary: '#FF4D6D', secondary: '#0D1220' } },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
