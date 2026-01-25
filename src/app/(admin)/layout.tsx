import AdminShell from "@/components/admin/adminShell";
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
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
