import "./globals.css";

import { SITE_ORIGIN } from "@/lib/seo";

export const metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default:
      "Metaoptics Technologies | Leading Metalens Manufacturer Singapore",
    template: "%s",
  },
  description:
    "Metaoptics Technologies offers advanced metalens manufacturing for AR, VR, and IoT devices, delivering miniaturization and high performance to support next-gen optical tech",
  keywords:
    "Lens manufacturers, mobile phone cameras, camera lens manufacture, metalens manufacturer",
  alternates: {
    canonical: SITE_ORIGIN,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased scale-container`}>{children}</body>
    </html>
  );
}
