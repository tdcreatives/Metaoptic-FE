import './globals.css';

export const metadata = {
    title: 'Metaoptics',
    description: 'Metaoptics is a design system for building modern web applications.',
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body className={`antialiased`}>{children}</body>
        </html>
    );
}
