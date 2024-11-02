import './globals.css';

export const metadata = {
    title: 'Metaoptics Technologies | Leading Metalens Manufacturer Singapore',
    description: 'Metaoptics Technologies offers advanced metalens manufacturing for AR, VR, and IoT devices, delivering miniaturization and high performance to support next-gen optical tech',
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body className={`antialiased scale-container`}>{children}</body>
        </html>
    );
}
