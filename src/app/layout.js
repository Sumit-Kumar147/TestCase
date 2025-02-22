import "./globals.css";

export const metadata = {
  title: "Test Case Generator",
  description: "Powered By Sumit's Brain",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
