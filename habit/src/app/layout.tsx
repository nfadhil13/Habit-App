import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { ReactQueryProvider } from "@/components/infrasructure/providers/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import LoadingOverlay from "@/components/infrasructure/layout/LoadingOverlay";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MY HABIT",
  description: "Enjoy!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-center" />
        <ReactQueryProvider>
          <LoadingOverlay>{children}</LoadingOverlay>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
