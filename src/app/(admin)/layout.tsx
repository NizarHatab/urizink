import AdminLayoutWrapper from "@/components/admin/admin-layout-wrapper";
import "../globals.css";

export const metadata = {
  title: "UrizInk Admin",
  description: "Studio admin dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen antialiased">
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      </body>
    </html>
  );
}
