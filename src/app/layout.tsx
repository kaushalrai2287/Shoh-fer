import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import BootstrapClient from "../../components/BootstrapClient";
import "./globals.css";
import HeadingBredcrum from "../../components/HeadingBredcrum";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <BootstrapClient/>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
