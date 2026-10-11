import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLogin } from "@/components/admin-login";

export const instant = false;

export const metadata = {
  title: "Admin — Orders",
};

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return <AdminLogin />;
  }
  return <AdminDashboard />;
}
