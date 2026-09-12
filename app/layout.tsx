import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MED CRM",
  description: "MED CRM frontend",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="/assets/css/main.min.css"
        />

        <link
          rel="stylesheet"
          href="/assets/css/Extra.css"
        />

        <link
          rel="stylesheet"
          href="/assets/vendors/bootstrap/dist/css/bootstrap.min.css"
        />

        <link
          rel="stylesheet"
          href="/assets/vendors/font-awesome/css/font-awesome.min.css"
        />

        <link
          rel="stylesheet"
          href="/assets/vendors/themify-icons/css/themify-icons.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
