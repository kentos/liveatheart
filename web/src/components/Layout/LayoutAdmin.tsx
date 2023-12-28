import Link from "next/link";
import useProfile from "~/hooks/useProfile";

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = useProfile();

  return (
    <div className="m-auto flex w-5/6 flex-col">
      <div className="flex items-center justify-between">
        <div className="my-2 flex gap-4">
          <Link href="/admin">Home</Link>
          <Link href="/admin/artists">Artists</Link>
          <Link href="/admin/venues">Venues</Link>
          <Link href="/admin/program">Program</Link>
          <Link href="/admin/news">News</Link>
        </div>
        <div>
          <div>Hi {profile?.firstName}</div>
          <Link href="/auth/logout">Logout</Link>
        </div>
      </div>
      {children}
    </div>
  );
}
