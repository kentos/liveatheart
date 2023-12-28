import Link from "next/link";
import LayoutAdmin from "~/components/Layout/LayoutAdmin";
import useProfile from "~/hooks/useProfile";

export default function AdminDashboard() {
  const profile = useProfile();

  return (
    <LayoutAdmin>
      <h1>Admin</h1>
      <h2>{profile?.firstName ?? "a"}</h2>

      <Link href="/admin/artists">Artists</Link>
      <Link href="/admin/news">News</Link>
    </LayoutAdmin>
  );
}
